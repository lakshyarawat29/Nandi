# comm_service/main.py

import os
import logging
import httpx
import websockets
import asyncio
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pymongo import MongoClient

# --- Configuration & DB Connection ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")
AI_SERVICE_URL = os.environ.get("STT_TTS_SERVICE_URL") # Renamed for clarity
AGENTIC_CORE_WEBSOCKET_URL = os.environ.get("AGENTIC_CORE_WEBSOCKET_URL")
FARMERS_COLLECTION = "farmers-data"

client = MongoClient(DATABASE_URL)
db = client.nandi_system
farmers_collection = db[FARMERS_COLLECTION]

app = FastAPI(title="NANDI Live Communication Service")

# --- Main WebSocket Endpoint ---
@app.websocket("/ws/chat/{phone_number}")
async def handle_live_chat(websocket: WebSocket, phone_number: str):
    await websocket.accept()
    
    farmer = farmers_collection.find_one({"_id": f"+{phone_number}"})
    if not farmer:
        await websocket.close(code=1008, reason="Farmer not found")
        return

    logger.info(f"Session started for {farmer['name']} ({farmer['_id']}).")

    # --- Session Language Pipeline ---
    # Determine the language to use for this entire conversation.
    supported_languages = ["Marathi", "Hindi", "Tamil", "English"]
    session_language = "English" # Default
    if farmer.get("primary_language") in supported_languages:
        session_language = farmer["primary_language"]
    elif farmer.get("secondary_language") in supported_languages:
        session_language = farmer["secondary_language"]
    
    logger.info(f"Session language set to: {session_language}")

    # --- Send Greeting ---
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            greeting_text = f"Hello {farmer['name'].split()[0]}, I am the NANDI assistant. How can I help you?"
            response = await client.post(
                f"{AI_SERVICE_URL}/process",
                json={"text": greeting_text, "source_lang": "English", "target_lang": session_language}
            )
            greeting = response.json()["result_text"]
            await websocket.send_text(json.dumps({"sender": "agent", "message": greeting}))
    except Exception as e:
        logger.error(f"Failed to send greeting: {e}")
        await websocket.send_text(json.dumps({"sender": "agent", "message": f"Hello {farmer['name']}."}))

    # --- Main Relay Loop ---
    try:
        async with websockets.connect(AGENTIC_CORE_WEBSOCKET_URL) as agent_socket:
            logger.info(f"Connected to Agentic Core for farmer {farmer['_id']}")

            async def forward_to_agent():
                """User -> English -> Agent"""
                while True:
                    raw_message = await websocket.receive_text()
                    data = json.loads(raw_message)
                    
                    # Process user input (STT and/or Translate to English)
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        process_payload = {
                            "source_lang": session_language,
                            "target_lang": "English"
                        }
                        if data.get("type") == "audio":
                            process_payload["media_url"] = data["url"]
                        else:
                            process_payload["text"] = data["message"]
                        
                        response = await client.post(f"{AI_SERVICE_URL}/process", json=process_payload)
                        english_text = response.json()["result_text"]

                    # Prepare and send packet to the agent
                    agent_packet = { "farmer_id": farmer["_id"], "query": english_text }
                    await agent_socket.send(json.dumps(agent_packet))

            async def forward_to_user():
                """Agent (English) -> User Language -> User"""
                async for agent_message_english in agent_socket:
                    # Translate agent's English response back to the user's session language
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        response = await client.post(
                            f"{AI_SERVICE_URL}/process",
                            json={"text": agent_message_english, "source_lang": "English", "target_lang": session_language}
                        )
                        user_lang_message = response.json()["result_text"]
                    
                    await websocket.send_text(json.dumps({"sender": "agent", "message": user_lang_message}))

            await asyncio.gather(forward_to_agent(), forward_to_user())

    except WebSocketDisconnect:
        logger.info(f"User {farmer['name']} disconnected.")
    except Exception as e:
        logger.error(f"An error occurred during the session for {farmer['name']}: {e}", exc_info=True)
    finally:
        logger.info(f"Live chat session ended for {farmer['name']}.")
