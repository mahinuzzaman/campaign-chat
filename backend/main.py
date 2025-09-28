from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import asyncio
import uuid
from datetime import datetime, timezone
import random

# Import our services
from services.campaign_generator import CampaignGenerator
from models.api_models import ChatRequest, ChatResponse, ConnectRequest, ConnectResponse, DataSourcesResponse

app = FastAPI(
    title="Campaign Chat API",
    description="API for the Campaign Chat Demo",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo
data_sources_state = {
    "google_ads": {
        "id": "google_ads",
        "name": "Google Ads",
        "status": "disconnected",
        "lastUpdated": None,
        "dataPoints": None
    },
    "shopify": {
        "id": "shopify",
        "name": "Shopify",
        "status": "disconnected",
        "lastUpdated": None,
        "dataPoints": None
    },
    "facebook_page": {
        "id": "facebook_page",
        "name": "Facebook Page",
        "status": "disconnected",
        "lastUpdated": None,
        "dataPoints": None
    }
}


# Data Sources endpoints
@app.get("/api/data-sources", response_model=DataSourcesResponse)
async def get_data_sources():
    """Get all available data sources and their connection status"""
    sources = list(data_sources_state.values())
    return DataSourcesResponse(sources=sources)

@app.post("/api/data-sources/{source_id}/connect", response_model=ConnectResponse)
async def connect_data_source(source_id: str, request: ConnectRequest):
    """Simulate connecting to a data source"""
    if source_id not in data_sources_state:
        raise HTTPException(status_code=404, detail="Data source not found")

    # Update status to connecting
    data_sources_state[source_id]["status"] = "connected"

    # Simulate connection delay
    await asyncio.sleep(1)

    return ConnectResponse(
        status="connecting",
        estimated_time=2000,
        message=f"Connecting to {data_sources_state[source_id]['name']}..."
    )

@app.delete("/api/data-sources/{source_id}/disconnect", response_model=ConnectResponse)
async def disconnect_data_source(source_id: str):
    """Disconnect from a data source"""
    if source_id not in data_sources_state:
        raise HTTPException(status_code=404, detail="Data source not found")

    data_sources_state[source_id]["status"] = "disconnected"
    data_sources_state[source_id]["lastUpdated"] = None
    data_sources_state[source_id]["dataPoints"] = None

    return ConnectResponse(
        status="disconnected",
        message=f"Disconnected from {data_sources_state[source_id]['name']}"
    )

# Chat endpoints
@app.post("/api/chat/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a user message and get campaign recommendations"""
    start_time = datetime.now()

    connected_sources = request.context.get("connected_sources", [])

    if not connected_sources:
        return ChatResponse(
            response="Please connect at least one data source to generate campaign recommendations.",
            campaigns=[],
            processing_time=100
        )

    # Simulate processing delay
    await asyncio.sleep(random.uniform(1, 3))

    # Generate campaign using our service
    campaign_generator = CampaignGenerator()
    campaign = campaign_generator.generate_campaign(
        message=request.message,
        connected_sources=connected_sources
    )

    # Generate response text
    response_text = campaign_generator.generate_response_text(
        campaign=campaign,
        user_message=request.message
    )

    processing_time = int((datetime.now() - start_time).total_seconds() * 1000)

    return ChatResponse(
        response=response_text,
        campaigns=[{
            "id": campaign["campaign_id"],
            "type": campaign["objective"],
            "confidence": campaign["confidence_score"],
            "jsonPayload": campaign,
            "createdAt": campaign["timestamp"]
        }],
        processing_time=processing_time
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)