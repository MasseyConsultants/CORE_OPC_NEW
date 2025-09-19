"""
Product schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    sku: str
    length: float
    width: float
    height: float
    weight: float
    active: bool = True
    customerId: str = "tyson"
    dryIceVolume: Optional[float] = 0
    dryIceWeight: Optional[float] = 0.5
    priority: int = 1
    requiresDryIce: bool = False
    hold: bool = False
    onHandPrimary: Optional[int] = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    active: Optional[bool] = None
    dryIceVolume: Optional[float] = None
    dryIceWeight: Optional[float] = None
    priority: Optional[int] = None
    requiresDryIce: Optional[bool] = None
    hold: Optional[bool] = None
    onHandPrimary: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    products: list[ProductResponse]
    total: int
    page: int
    size: int
