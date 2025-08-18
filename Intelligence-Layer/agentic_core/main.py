# This file is the same mock agentic core from the previous response.
# It simulates the AI brain's conversational flow.

import asyncio
import logging
import ast
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mock Agentic Core")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Connection accepted from Communication Service.")
    try:
        initial_data = await websocket.receive_text()
        # The string might be a dict representation, so we use ast.literal_eval
        query_data = ast.literal_eval(initial_data)
        logger.info(f"Received processed query: {query_data}")
        
        query_text = query_data.get('query_text', '')

        await websocket.send_text(f"Okay, I've received your query about '{query_text}'. Let me check.")
        await asyncio.sleep(2)

        await websocket.send_text("Based on the latest forecast, we expect light rain tomorrow.")
        await asyncio.sleep(3)

        await websocket.send_text("The current market price for your main crop is stable. Is there anything else I can help with?")
        await asyncio.sleep(4)
        
        await websocket.send_text("Thank you for using NANDI.")
        logger.info("Finished processing. Closing connection.")

    except WebSocketDisconnect:
        logger.warning("Communication Service disconnected.")
    except Exception as e:
        logger.error(f"An error occurred in the agent core: {e}", exc_info=True)
    finally:
        await websocket.close()
