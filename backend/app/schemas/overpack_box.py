"""
Overpack Box schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OverpackBoxBase(BaseModel):
    name: str
    length: float
    width: float
    height: float
    maxWeight: float
    active: bool = True
    cost: Optional[float] = 0
    customerId: str = "tyson"

class OverpackBoxCreate(OverpackBoxBase):
    pass

class OverpackBoxUpdate(BaseModel):
    name: Optional[str] = None
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    maxWeight: Optional[float] = None
    active: Optional[bool] = None
    cost: Optional[float] = None
    customerId: Optional[str] = None

class OverpackBoxResponse(OverpackBoxBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

class OverpackBoxListResponse(BaseModel):
    boxes: list[OverpackBoxResponse]
    total: int
    page: int
    size: int
