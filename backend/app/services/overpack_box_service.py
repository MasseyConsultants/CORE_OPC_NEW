"""
Overpack Box service
"""

from sqlalchemy.orm import Session
from app.models.overpack_box import OverpackBox
from app.schemas.overpack_box import OverpackBoxCreate, OverpackBoxUpdate
from typing import List, Optional

class OverpackBoxService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_boxes(
        self, 
        customer_id: Optional[str] = None,
        active_only: bool = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[OverpackBox]:
        """
        Get overpack boxes with optional filtering
        """
        query = self.db.query(OverpackBox)
        
        if customer_id:
            query = query.filter(OverpackBox.customerId == customer_id)
        
        if active_only:
            query = query.filter(OverpackBox.active == True)
        
        return query.offset(skip).limit(limit).all()
    
    def get_box_by_id(self, box_id: int) -> Optional[OverpackBox]:
        """
        Get overpack box by ID
        """
        return self.db.query(OverpackBox).filter(OverpackBox.id == box_id).first()
    
    def create_box(self, box_data: OverpackBoxCreate) -> OverpackBox:
        """
        Create a new overpack box
        """
        db_box = OverpackBox(**box_data.dict())
        self.db.add(db_box)
        self.db.commit()
        self.db.refresh(db_box)
        return db_box
    
    def update_box(self, box_id: int, box_data: OverpackBoxUpdate) -> Optional[OverpackBox]:
        """
        Update overpack box
        """
        box = self.get_box_by_id(box_id)
        if not box:
            return None
        
        # Update fields if provided
        update_data = box_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(box, field, value)
        
        self.db.commit()
        self.db.refresh(box)
        return box
    
    def delete_box(self, box_id: int) -> bool:
        """
        Soft delete overpack box (set active = False)
        """
        box = self.get_box_by_id(box_id)
        if not box:
            return False
        
        box.active = False
        self.db.commit()
        return True
    
    def get_boxes_count(self, customer_id: Optional[str] = None, active_only: bool = True) -> int:
        """
        Get total count of overpack boxes
        """
        query = self.db.query(OverpackBox)
        
        if customer_id:
            query = query.filter(OverpackBox.customerId == customer_id)
        
        if active_only:
            query = query.filter(OverpackBox.active == True)
        
        return query.count()
