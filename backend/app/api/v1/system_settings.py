"""
System Settings API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.system_settings import SystemSettings
from app.schemas.system_settings import SystemSettingsResponse, SystemSettingsUpdate
from app.auth.dependencies import get_db, get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=SystemSettingsResponse)
def get_system_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get system settings
    """
    settings = db.query(SystemSettings).first()
    if not settings:
        # Create default settings if none exist
        settings = SystemSettings(
            id="default",
            companyName="AIT Logistics CORE",
            debugMode=False
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@router.put("/", response_model=SystemSettingsResponse)
def update_system_settings(
    settings_update: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update system settings
    """
    settings = db.query(SystemSettings).first()
    if not settings:
        # Create new settings if none exist
        settings = SystemSettings(id="default")
        db.add(settings)
    
    # Update fields
    update_data = settings_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    return settings
