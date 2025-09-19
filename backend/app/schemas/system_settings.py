"""
System Settings schemas
"""

from pydantic import BaseModel
from typing import Optional

class SystemSettingsResponse(BaseModel):
    id: str
    companyName: str
    companyLogoUrl: Optional[str] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    debugMode: bool
    createdAt: str
    updatedAt: str

    model_config = {
        "from_attributes": True
    }

class SystemSettingsUpdate(BaseModel):
    companyName: Optional[str] = None
    companyLogoUrl: Optional[str] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    debugMode: Optional[bool] = None
