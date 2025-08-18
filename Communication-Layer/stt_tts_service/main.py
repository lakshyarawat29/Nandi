# stt_tts_service/main.py
# This is the new, production-ready service using real models from Hugging Face.

import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import torch
import librosa
# from datasets import Audio

# --- Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Pydantic Models ---
class ProcessRequest(BaseModel):
    text: str = None
    media_url: str = None # Path to a local file for simulation
    source_lang: str
    target_lang: str

# --- AI Model Loading ---
# This happens once when the service starts up.
# Using a GPU will be much faster if available.
device = 0 if torch.cuda.is_available() else -1
logger.info(f"Using device: {'GPU' if device == 0 else 'CPU'}")

# Load Speech-to-Text Model (OpenAI's Whisper)
# This model is large and will be downloaded on the first run.
stt_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base", # 'base' is a good balance of size and accuracy
    device=device
)

# Load Translation Models (Helsinki-NLP)
# We create a dictionary to hold different translation pipelines as they are requested.
translation_pipelines = {}

SUPPORTED_LANGUAGES = {
    "English": "en",
    "Hindi": "hi",
    "Marathi": "mr",
    "Tamil": "ta",
}

app = FastAPI(
    title="NANDI Production AI Service",
    description="Handles multilingual STT and Translation using real models."
)

@app.on_event("startup")
async def startup_event():
    logger.info("AI Service is starting up and loading models...")
    # You can pre-load common pipelines here if you want
    # get_translation_pipeline("hi", "en")
    logger.info("Models loaded and service ready.")

def get_translation_pipeline(source_lang_code, target_lang_code):
    """
    Dynamically loads and caches a translation pipeline for the requested language pair.
    """
    model_name = f"Helsinki-NLP/opus-mt-{source_lang_code}-{target_lang_code}"
    pipeline_key = f"{source_lang_code}-{target_lang_code}"

    if pipeline_key in translation_pipelines:
        return translation_pipelines[pipeline_key]
    
    try:
        logger.info(f"Loading translation model: {model_name}")
        translator = pipeline("translation", model=model_name, device=device)
        translation_pipelines[pipeline_key] = translator
        return translator
    except Exception as e:
        logger.error(f"Could not load model {model_name}. It may not exist. Error: {e}")
        return None

# --- API Endpoints ---
@app.post("/process")
async def process_request(request: ProcessRequest):
    """
    A single, powerful endpoint to handle all transformations.
    """
    initial_text = request.text
    
    # 1. Speech-to-Text (if audio is provided)
    if request.media_url:
        try:
            logger.info(f"Transcribing audio from: {request.media_url}")
            # Simulate loading audio. In a real scenario, you'd download from the URL.
            # For Whisper, we need to load it into a specific format.
            # We'll create a dummy audio file for this simulation.
            dummy_audio_path = "dummy_audio.wav"
            sr = 16000
            librosa.output.write_wav(dummy_audio_path, librosa.chirp(duration=2, fmin=100, fmax=sr/2, sr=sr), sr)
            
            # Transcribe
            transcription = stt_pipeline(dummy_audio_path)
            initial_text = transcription["text"]
            logger.info(f"Transcription result: {initial_text}")
        except Exception as e:
            logger.error(f"STT failed: {e}")
            raise HTTPException(status_code=500, detail="Speech-to-text processing failed.")

    if not initial_text:
        raise HTTPException(status_code=400, detail="No text provided or transcribed.")

    # 2. Translation (if source and target languages are different)
    if request.source_lang == request.target_lang:
        return {"result_text": initial_text}

    source_code = SUPPORTED_LANGUAGES.get(request.source_lang)
    target_code = SUPPORTED_LANGUAGES.get(request.target_lang)

    if not source_code or not target_code:
        raise HTTPException(status_code=400, detail="Unsupported language specified.")

    try:
        translator = get_translation_pipeline(source_code, target_code)
        if not translator:
            raise HTTPException(status_code=501, detail=f"Translation from {request.source_lang} to {request.target_lang} is not supported.")

        translated_text = translator(initial_text)[0]['translation_text']
        logger.info(f"Translated '{initial_text}' ({source_code}) -> '{translated_text}' ({target_code})")
        return {"result_text": translated_text}
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail="Translation processing failed.")
