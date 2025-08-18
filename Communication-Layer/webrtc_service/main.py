# This service handles the WebRTC connection for live audio streaming.
# It uses the 'aiortc' library to manage the peer-to-peer connection.

import asyncio
import json
import logging
import uuid
from fastapi import FastAPI, HTTPException, Request
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaRelay, MediaStreamTrack
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NANDI WebRTC Media Server")
pcs = set() # Set to store active peer connections

# This is a placeholder for a real audio track that would process incoming audio
class AudioProcessorTrack(MediaStreamTrack):
    kind = "audio"

    def __init__(self, track, farmer_id, language):
        super().__init__()
        self.track = track
        self.farmer_id = farmer_id
        self.language = language
        self.is_speaking = False

    async def recv(self):
        frame = await self.track.recv()
        # In a real implementation, you would process the audio frame here.
        # For example, you could check the audio volume to detect speech.
        # If speech is detected, you'd start streaming these frames to an STT service.
        # For this simulation, we'll rely on the client to tell us when to "transcribe".
        return frame

@app.post("/offer")
async def offer(request: Request):
    """
    Handles the signaling process to establish a WebRTC connection.
    The browser sends an "offer", and this endpoint returns an "answer".
    """
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
    
    pc = RTCPeerConnection()
    pc_id = f"PeerConnection({uuid.uuid4()})"
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        logger.info(f"[{pc_id}] Connection state is {pc.connection_state}")
        if pc.connection_state == "failed":
            await pc.close()
            pcs.discard(pc)

    @pc.on("track")
    def on_track(track):
        logger.info(f"[{pc_id}] Track {track.kind} received")
        # Here we would attach the track to our audio processor
        # For now, we just log it.
        if track.kind == "audio":
            pc.addTrack(AudioProcessorTrack(track, params.get("farmer_id"), params.get("language")))

    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}

