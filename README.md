# Anusandhan

## Description

Anusandhan is a web application designed for analyzing video interviews. It allows users to either record interviews directly through their webcam or upload existing video files. The application then processes the audio to transcribe the speech, perform speaker diarization (identifying who spoke when), and generate comprehensive reports. These reports include text summaries, sentiment analysis, word clouds for positive and negative sentiments, bar plots for word frequencies, and semantic analysis graphs.

## Features

* **User Authentication:** Secure login and registration using email/password and Google (via Auth0).
* **Video Recording:** Record video interviews directly in the browser using the webcam.
* **Video Upload:** Upload existing video files for analysis.
* **Audio Transcription:** Converts speech from the video audio into text.
* **Speaker Diarization:** Identifies different speakers in the audio and timestamps their speech.
* **Report Generation:** Creates detailed analysis reports including:
    * Full transcription text and summary.
    * Positive and Negative Word Clouds.
    * Bar plots for high and low-frequency words.
    * Semantic analysis graph based on user input.

## Tech Stack

* **Frontend:**
    * React
    * Vite
    * Tailwind CSS
    * Auth0 (for authentication)
    * Axios (for API calls)
    * Flowbite, Rsuite (UI components)
    * React Router DOM
* **Backend:**
    * Flask
    * NLTK
    * WordCloud
    * Sumy (for summarization)
    * VaderSentiment (for sentiment analysis)
    * NetworkX (for semantic graphs)
    * SpeechRecognition
    * Pydub, FFmpeg (for audio processing)
    * Matplotlib
* **Diarization & Transcription Service:**
    * Flask
    * WhisperX
    * NeMo (NeuralDiarizer)
    * DeepMultilingualPunctuation
    * CTC Forced Aligner
    * Demucs (for audio stemming)

## Setup and Installation

### Prerequisites

* Python 3.x
* Node.js and npm/yarn
* FFmpeg

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows use `venv\Scripts\activate`
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the Flask applications (ensure ports don't conflict):
    ```bash
    # Main backend (auth, analysis) - default port 5090
    python backend.py

    # Audio processing backend - default port 9090
    python wav2string.py

    # Semantics backend - default port 5091
    python semantics.py
    ```
    *(Note: You might need multiple terminals or run them as background processes)*

### Diarization Service

1.  Navigate to the `diarize` directory:
    ```bash
    cd diarize
    ```
2.  Create and activate a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows use `venv\Scripts\activate`
    ```
3.  Install dependencies (this might take a while, especially for PyTorch/NeMo):
    ```bash
    pip install -r requirements.txt
    # Ensure CUDA is set up if using GPU for NeMo/WhisperX
    ```
4.  Run the Flask application:
    ```bash
    python app.py
    ```

## Usage

1.  Ensure all backend services (backend.py, wav2string.py, semantics.py, diarize/app.py) and the frontend development server are running.
2.  Open your browser and navigate to the frontend URL (usually `http://localhost:5173` provided by Vite).
3.  Register a new account or log in.
4.  On the main interface, either start recording using your webcam or upload a video file.
5.  After recording/uploading, process the video to get the transcription and analysis.
6.  Click "Get Report" to view the detailed analysis including summaries, word clouds, and graphs.
