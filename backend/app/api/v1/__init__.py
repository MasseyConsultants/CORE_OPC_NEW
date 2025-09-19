"""
API v1 package
"""

from fastapi import APIRouter
from .auth import router as auth_router
from .products import router as products_router
from .customers import router as customers_router
from .overpack_boxes import router as overpack_boxes_router

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(products_router, prefix="/products", tags=["products"])
api_router.include_router(customers_router, prefix="/customers", tags=["customers"])
api_router.include_router(overpack_boxes_router, prefix="/overpack-boxes", tags=["overpack-boxes"])