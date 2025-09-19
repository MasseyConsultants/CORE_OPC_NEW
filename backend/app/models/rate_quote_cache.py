"""
Rate Quote Cache model
"""

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class RateQuoteCache(Base):
    __tablename__ = "rate_quote_cache"
    
    id = Column(String, primary_key=True, index=True)
    customerId = Column(String, ForeignKey("customers.id"), nullable=False)
    originZip = Column(String, nullable=False)
    destinationZip = Column(String, nullable=False)
    serviceLevel = Column(String, nullable=False)
    billingWeight = Column(Float, nullable=False)
    boxSignature = Column(String, nullable=True)
    zone = Column(String, nullable=True)
    rate = Column(Float, nullable=False)
    source = Column(String, nullable=False, default="TARIFF")
    requestHash = Column(String, nullable=False)
    carrierResponse = Column(JSON, nullable=True)
    expiresAt = Column(DateTime(timezone=True), nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
