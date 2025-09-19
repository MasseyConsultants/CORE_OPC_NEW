"""
Zone lookup API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.auth.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.tyson_tariff import TysonZipToZoneMatrix

router = APIRouter()

@router.get("/lookup/{zip_code}")
def lookup_zone(
    zip_code: str,
    db: Session = Depends(get_db)
):
    """
    Look up shipping zone from ZIP code
    """
    if len(zip_code) != 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ZIP code must be 5 digits"
        )

    # Look up zone from database
    result = db.query(TysonZipToZoneMatrix).filter(
        TysonZipToZoneMatrix.destination_zip == zip_code
    ).first()

    if result:
        return {
            "zip_code": zip_code,
            "zone": result.zone
        }
    else:
        # If not found in database, estimate based on last 3 digits
        last_three = int(zip_code[-3:])
        estimated_zone = min(10, max(1, (last_three // 100) + 1))
        
        return {
            "zip_code": zip_code,
            "zone": estimated_zone,
            "estimated": True
        }
