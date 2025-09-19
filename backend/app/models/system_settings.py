"""
System Settings model
"""

from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    id = Column(String, primary_key=True, index=True)
    companyName = Column(String, nullable=False, default="AIT Logistics CORE")
    companyLogoUrl = Column(String, nullable=True)
    primaryColor = Column(String, nullable=True)
    secondaryColor = Column(String, nullable=True)
    debugMode = Column(Boolean, nullable=False, default=False, name="debugmode")
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
