from typing import Any, Dict, List, Optional

from pydantic import BaseModel


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
