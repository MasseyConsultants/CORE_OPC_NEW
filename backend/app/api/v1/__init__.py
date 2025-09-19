"""
API v1 package
"""

from fastapi import APIRouter
from .auth import router as auth_router
from .products import router as products_router
from .customers import router as customers_router
from .overpack_boxes import router as overpack_boxes_router
from .calculations import router as calculations_router
from .zone_lookup import router as zone_lookup_router
from .system_settings import router as system_settings_router

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(products_router, prefix="/products", tags=["products"])
api_router.include_router(customers_router, prefix="/customers", tags=["customers"])
api_router.include_router(overpack_boxes_router, prefix="/overpack-boxes", tags=["overpack-boxes"])
api_router.include_router(calculations_router, prefix="/calculations", tags=["calculations"])
api_router.include_router(zone_lookup_router, prefix="/zone-lookup", tags=["zone-lookup"])
api_router.include_router(system_settings_router, prefix="/system-settings", tags=["system-settings"])