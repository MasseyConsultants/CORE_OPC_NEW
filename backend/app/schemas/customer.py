"""
Customer schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    logoUrl: Optional[str] = None
    active: bool = True
    displayName: str

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    logoUrl: Optional[str] = None
    active: Optional[bool] = None
    displayName: Optional[str] = None

class CustomerResponse(CustomerBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True
