Make sure you read this document first to completely setup the RAG pipeline, before running the code.

# RAG Model Setup Instructions

This document provides a step-by-step guide to set up the RAG (Retrieval-Augmented Generation) model environment.

based on your operating system select one of the scripts from the `scripts` folder and run it to install the required dependencies.
"scripts/setup-and-start.sh" for Linux/Mac or "scripts/setup-and-start.bat" for Windows.

the script assumes cuda 12.6 is installed, if you have a different version of cuda installed, please change the version of torch in the script, get it from https://pytorch.org/get-started/locally/

make sure the environment variable are also set correctly, you can check the .env.example file in the RAG Model folder for reference. You can copy it to a new file named `.env` and modify the values as needed.

to run the RAG model, you can use the following command:

```bash
uvicorn api:app --reload
```

this will start the FastAPI server, and you can access the API at `http://localhost:8000`.

you can use POSTMAN to check for the output too:

```bash
POST http://localhost:8000/ask
body: raw:json
{
  "question": "Rice plants are having pest problem what should I do to fix this?",
  "context": {
    "location": "Pilakhuwa, Uttar Pradesh",
    "weather_forecast": "Cloudy, 37°C, medium to heavy rain expected",
    "soil_type": "Deep soil, Yello coloured alluvial loam soils",
    "current_crop": "wheat",
    "farm_size_acres": 3.4

}
```
