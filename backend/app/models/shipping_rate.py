"""
Shipping Rate model
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class ShippingRate(Base):
    __tablename__ = "shipping_rates"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    serviceLevel = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    weightBand = Column(Integer, nullable=False)
    rate = Column(Float, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
