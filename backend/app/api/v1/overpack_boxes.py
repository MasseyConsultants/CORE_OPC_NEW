"""
Overpack Box API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.schemas.overpack_box import OverpackBoxResponse, OverpackBoxCreate, OverpackBoxUpdate, OverpackBoxListResponse
from app.services.overpack_box_service import OverpackBoxService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=OverpackBoxListResponse)
def get_boxes(
    customer_id: Optional[str] = Query(None, description="Filter by customer ID"),
    active_only: bool = Query(True, description="Show only active boxes"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(100, ge=1, le=1000, description="Page size"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get overpack boxes with optional filtering
    """
    box_service = OverpackBoxService(db)
    
    # Calculate skip value
    skip = (page - 1) * size
    
    # Get boxes
    boxes = box_service.get_boxes(
        customer_id=customer_id,
        active_only=active_only,
        skip=skip,
        limit=size
    )
    
    # Get total count
    total = box_service.get_boxes_count(
        customer_id=customer_id,
        active_only=active_only
    )
    
    return OverpackBoxListResponse(
        boxes=boxes,
        total=total,
        page=page,
        size=size
    )

@router.get("/{box_id}", response_model=OverpackBoxResponse)
def get_box(
    box_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get overpack box by ID
    """
    box_service = OverpackBoxService(db)
    box = box_service.get_box_by_id(box_id)
    
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Overpack box not found"
        )
    
    return box

@router.post("/", response_model=OverpackBoxResponse)
def create_box(
    box_data: OverpackBoxCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new overpack box
    """
    box_service = OverpackBoxService(db)
    box = box_service.create_box(box_data)
    return box

@router.put("/{box_id}", response_model=OverpackBoxResponse)
def update_box(
    box_id: int,
    box_data: OverpackBoxUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update overpack box
    """
    box_service = OverpackBoxService(db)
    box = box_service.update_box(box_id, box_data)
    
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Overpack box not found"
        )
    
    return box

@router.delete("/{box_id}")
def delete_box(
    box_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete overpack box (soft delete)
    """
    box_service = OverpackBoxService(db)
    success = box_service.delete_box(box_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Overpack box not found"
        )
    
    return {"message": "Overpack box deleted successfully"}
