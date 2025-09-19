"""
Overpack Box model
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class OverpackBox(Base):
    __tablename__ = "overpack_boxes"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    length = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    maxWeight = Column(Float, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    cost = Column(Float, nullable=True, default=0)
    customerId = Column(String, ForeignKey("customers.id"), nullable=False, default="tyson")
