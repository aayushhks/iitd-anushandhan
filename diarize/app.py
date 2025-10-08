from flask import Flask, request, render_template, jsonify
import tempfile
from time import time
import json
import requests


import os
import wget
from omegaconf import OmegaConf
import shutil
import torch
import torchaudio
from nemo.collections.asr.models.msdd_models import NeuralDiarizer
from deepmultilingualpunctuation import PunctuationModel
import re
import logging
import nltk
from whisperx.utils import LANGUAGES, TO_LANGUAGE_CODE
from ctc_forced_aligner import (
    load_alignment_model,
    generate_emissions,
    preprocess_text,
    get_alignments,
    get_spans,
    postprocess_results,
)

from diarize import *

app = Flask(__name__)

transcript_output = []
srt_output = []

@app.route('/')
def home():
    return render_template('index.html')

# Endpoint to transcribe audio
@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        # Check if an audio file is sent with the request
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided."}), 400

        # Retrieve the audio file from the request
        audio_file = request.files['audio']

        # Save the uploaded audio file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            temp_file.write(audio_file.read())
            temp_file_path = temp_file.name

        # Call the transcribe function
        transcript = transcribe(temp_file_path)

        # Return the transcription result
        return jsonify({"transcript": transcript}), 200

    except Exception as e:
        logging.error(f"Error during transcription: {str(e)}")
        return jsonify({"error": str(e)}), 500

def transcribe(audio_path):
    enable_stemming = True
    whisper_model_name = "large-v2"
    suppress_numerals = True
    batch_size = 8
    language = None  # autodetect language
    device = "cpu"

    if enable_stemming:
        return_code = os.system(
            f'python3 -m demucs.separate -n htdemucs --two-stems=vocals "{audio_path}" -o "temp_outputs"'
        )
        if return_code != 0:
            logging.warning("Source splitting failed, using original audio file.")
            vocal_target = audio_path
        else:
            vocal_target = os.path.join(
                "temp_outputs",
                "htdemucs",
                os.path.splitext(os.path.basename(audio_path))[0],
                "vocals.wav",
            )
    else:
        vocal_target = audio_path

    compute_type = "int8"
    whisper_results, language, audio_waveform = transcribe_batched(
        vocal_target,
        language,
        batch_size,
        whisper_model_name,
        compute_type,
        suppress_numerals,
        device,
    )
    alignment_model, alignment_tokenizer= load_alignment_model(
    device,
    dtype=torch.float16 if device == "cuda" else torch.float32,
    )

    audio_waveform = (
        torch.from_numpy(audio_waveform)
        .to(alignment_model.dtype)
        .to(alignment_model.device)
    )

    emissions, stride = generate_emissions(
        alignment_model, audio_waveform, batch_size=batch_size
    )

    del alignment_model
    torch.cuda.empty_cache()

    full_transcript = "".join(segment["text"] for segment in whisper_results)

    tokens_starred, text_starred = preprocess_text(
        full_transcript,
        romanize=True,
        language=langs_to_iso[language],
    )

    segments, scores, blank_token = get_alignments(
        emissions,
        tokens_starred,
        alignment_tokenizer,
    )

    spans = get_spans(tokens_starred, segments, blank_token)

    word_timestamps = postprocess_results(text_starred, spans, stride, scores)

    ROOT = os.getcwd()
    temp_path = os.path.join(ROOT, "temp_outputs")
    os.makedirs(temp_path, exist_ok=True)
    torchaudio.save(
        os.path.join(temp_path, "mono_file.wav"),
        audio_waveform.cpu().unsqueeze(0).float(),
        16000,
        channels_first=True,
    )
    # Initialize NeMo MSDD diarization model
    msdd_model = NeuralDiarizer(cfg=create_config(temp_path)).to("cuda")
    msdd_model.diarize()

    del msdd_model
    torch.cuda.empty_cache()
    # Reading timestamps <> Speaker Labels mapping

    speaker_ts = []
    with open(os.path.join(temp_path, "pred_rttms", "mono_file.rttm"), "r") as f:
        lines = f.readlines()
        for line in lines:
            line_list = line.split(" ")
            s = int(float(line_list[5]) * 1000)
            e = s + int(float(line_list[8]) * 1000)
            speaker_ts.append([s, e, int(line_list[11].split("_")[-1])])

    wsm = get_words_speaker_mapping(word_timestamps, speaker_ts, "start")
    if language in punct_model_langs:
        # restoring punctuation in the transcript to help realign the sentences
        punct_model = PunctuationModel(model="kredor/punctuate-all")

        words_list = list(map(lambda x: x["word"], wsm))

        labled_words = punct_model.predict(words_list,chunk_size=230)

        ending_puncts = ".?!"
        model_puncts = ".,;:!?"

        # We don't want to punctuate U.S.A. with a period. Right?
        is_acronym = lambda x: re.fullmatch(r"\b(?:[a-zA-Z]\.){2,}", x)

        for word_dict, labeled_tuple in zip(wsm, labled_words):
            word = word_dict["word"]
            if (
                word
                and labeled_tuple[1] in ending_puncts
                and (word[-1] not in model_puncts or is_acronym(word))
            ):
                word += labeled_tuple[1]
                if word.endswith(".."):
                    word = word.rstrip(".")
                word_dict["word"] = word

    else:
      logging.warning(
            f"Punctuation restoration is not available for {language} language. Using the original punctuation."
        )

    wsm = get_realigned_ws_mapping_with_punctuation(wsm)
    ssm = get_sentences_speaker_mapping(wsm, speaker_ts)
    # Store transcript in a variable
     # Store transcript in a variable
    with open(f"{os.path.splitext(audio_path)[0]}.txt", "w", encoding="utf-8-sig") as f:
        get_speaker_aware_transcript(ssm, f)
    with open(f"{os.path.splitext(audio_path)[0]}.txt", "r", encoding="utf-8-sig") as f:
        transcript_output = f.read()
    cleanup(temp_path)

    return transcript_output

if __name__ == "__main__":
    app.run(debug=True)
