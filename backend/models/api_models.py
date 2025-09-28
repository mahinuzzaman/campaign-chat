from pydantic import BaseModel
from typing import List, Optional, Dict, Any


# Chat Models
class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]


class ChatResponse(BaseModel):
    response: str
    campaigns: List[Dict[str, Any]]
    processing_time: int


# Data Source Models
class ConnectRequest(BaseModel):
    credentials: Optional[Dict[str, Any]] = None


class ConnectResponse(BaseModel):
    status: str
    estimated_time: Optional[int] = None
    message: str


class DataSourcesResponse(BaseModel):
    sources: List[Dict[str, Any]]