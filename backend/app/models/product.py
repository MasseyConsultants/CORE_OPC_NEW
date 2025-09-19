"""
Product model
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    length = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    customerId = Column(String, ForeignKey("customers.id"), nullable=False, default="tyson")
    dryIceVolume = Column(Float, nullable=True, default=0)
    dryIceWeight = Column(Float, nullable=True, default=0.5)
    priority = Column(Integer, nullable=False, default=1)
    requiresDryIce = Column(Boolean, nullable=False, default=False)
    hold = Column(Boolean, nullable=False, default=False)
    onHandPrimary = Column(Integer, nullable=True, default=0)
