"""
API v1 package
"""

from fastapi import APIRouter
from .auth import router as auth_router

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])