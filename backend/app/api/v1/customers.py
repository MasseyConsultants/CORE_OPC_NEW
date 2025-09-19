"""
Customer API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.customer import CustomerResponse, CustomerCreate, CustomerUpdate
from app.services.customer_service import CustomerService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all customers
    """
    customer_service = CustomerService(db)
    customers = customer_service.get_customers(active_only=active_only)
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get customer by ID
    """
    customer_service = CustomerService(db)
    customer = customer_service.get_customer_by_id(customer_id)
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return customer

@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new customer
    """
    customer_service = CustomerService(db)
    
    try:
        customer = customer_service.create_customer(customer_data)
        return customer
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: str,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update customer
    """
    customer_service = CustomerService(db)
    customer = customer_service.update_customer(customer_id, customer_data)
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return customer

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete customer (soft delete)
    """
    customer_service = CustomerService(db)
    success = customer_service.delete_customer(customer_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return {"message": "Customer deleted successfully"}
