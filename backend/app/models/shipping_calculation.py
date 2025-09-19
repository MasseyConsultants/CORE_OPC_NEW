"""
Shipping Calculation model
"""

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class ShippingCalculation(Base):
    __tablename__ = "shipping_calculations"
    
    id = Column(String, primary_key=True, index=True)
    userId = Column(String, ForeignKey("users.id"), nullable=True)
    destinationZip = Column(String, nullable=False)
    serviceLevel = Column(String, nullable=False)
    optimalBox = Column(JSON, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    calculationType = Column(String, nullable=False, default="SHIPPING")
    customerId = Column(String, ForeignKey("customers.id"), nullable=False, default="tyson")
    originZip = Column(String, nullable=True)
    packages = Column(JSON, nullable=False)
    totalCost = Column(Float, nullable=False)
    totalWeight = Column(Float, nullable=False)
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
