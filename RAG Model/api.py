# api.py
# This is the main FastAPI application file.
# It serves the RAG model as an API endpoint that accepts contextual information.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import uvicorn
from typing import Optional

# Import the handler functions from our other file
from rag_handler import setup_qa_chain

# --- Pydantic Models for Request Body ---
# These models define the structure of the data your API expects.

class Context(BaseModel):
    """Defines the contextual data sent by the agent."""
    location: str = Field(..., example="Bhopal, Madhya Pradesh")
    weather_forecast: Optional[str] = Field(None, example="Clear skies, 35°C. No rain expected for 7 days.")
    soil_type: Optional[str] = Field(None, example="Black Cotton Soil")
    current_crop: Optional[str] = Field(None, example="Soybean")
    # Add any other relevant context fields here
    farm_size_acres: Optional[float] = Field(None, example=5.0)


class QueryRequest(BaseModel):
    """The main request body for the /ask endpoint."""
    question: str = Field(..., example="What is the best fertilizer to use for my next crop?")
    context: Context

# --- FastAPI Application ---

app = FastAPI(
    title="NANDI RAG API",
    description="An API for querying agricultural knowledge with real-time context.",
    version="1.0.0"
)

# This will hold our loaded QA chain so we don't reload it on every request
qa_chain = None

@app.on_event("startup")
def load_model():
    """
    This function is called when the FastAPI application starts.
    It loads the RAG model into memory.
    """
    global qa_chain
    qa_chain = setup_qa_chain()
    if qa_chain is None:
        print("FATAL: QA Chain could not be initialized. The API will not work.")
    else:
        print("--- RAG Model and API are ready ---")

def construct_rich_prompt(request: QueryRequest) -> str:
    """
    This is the core of the new logic. It combines the user's question
    with the context provided by the agent into a single, detailed prompt.
    """
    ctx = request.context
    prompt = (
        f"A farmer is asking for advice. Here is their situation:\n"
        f"- Location: {ctx.location}\n"
    )
    if ctx.soil_type:
        prompt += f"- Soil Type: {ctx.soil_type}\n"
    if ctx.current_crop:
        prompt += f"- Previous/Current Crop: {ctx.current_crop}\n"
    if ctx.weather_forecast:
        prompt += f"- Weather Forecast: {ctx.weather_forecast}\n"
    
    prompt += (
        f"\nBased on this context and verified ICAR research, answer the following question: "
        f"'{request.question}'"
    )
    return prompt

@app.post("/ask")
async def ask_question(request: QueryRequest):
    """
    The main endpoint for the agent to call. It takes the farmer's question
    and all the gathered context, constructs a rich prompt, and gets an answer.
    """
    if qa_chain is None:
        raise HTTPException(
            status_code=503, 
            detail="Model is not ready or failed to load. Check server logs."
        )

    print("Received request with context...")
    
    # 1. Construct the detailed prompt
    rich_prompt = construct_rich_prompt(request)
    print(f"Constructed Rich Prompt: {rich_prompt}")
    
    # 2. Run the prompt through the QA chain
    result = qa_chain({'query': rich_prompt})
    
    # 3. Format and return the response
    return {
        "answer": result.get('result'),
        "sources": [
            {
                "source_file": doc.metadata.get('source', 'Unknown').split('/')[-1], # Show only filename
                "page": doc.metadata.get('page', 'N/A'),
            } for doc in result.get('source_documents', [])
        ]
    }

if __name__ == "__main__":
    # To run this API:
    # 1. Make sure you have the vectorstore created (run rag_handler.py first)
    # 2. Run this command in your terminal: uvicorn api:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000)
