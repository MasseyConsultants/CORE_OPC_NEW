"""
Product API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate, ProductListResponse
from app.services.product_service import ProductService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=ProductListResponse)
def get_products(
    customer_id: Optional[str] = Query(None, description="Filter by customer ID"),
    active_only: bool = Query(True, description="Show only active products"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(100, ge=1, le=1000, description="Page size"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get products with optional filtering
    """
    product_service = ProductService(db)
    
    # Calculate skip value
    skip = (page - 1) * size
    
    # Get products
    products = product_service.get_products(
        customer_id=customer_id,
        active_only=active_only,
        skip=skip,
        limit=size
    )
    
    # Get total count
    total = product_service.get_products_count(
        customer_id=customer_id,
        active_only=active_only
    )
    
    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        size=size
    )

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get product by ID
    """
    product_service = ProductService(db)
    product = product_service.get_product_by_id(product_id)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

@router.get("/sku/{sku}", response_model=ProductResponse)
def get_product_by_sku(
    sku: str,
    customer_id: Optional[str] = Query(None, description="Customer ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get product by SKU
    """
    product_service = ProductService(db)
    product = product_service.get_product_by_sku(sku, customer_id)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new product
    """
    product_service = ProductService(db)
    
    try:
        product = product_service.create_product(product_data)
        return product
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update product
    """
    product_service = ProductService(db)
    product = product_service.update_product(product_id, product_data)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete product (soft delete)
    """
    product_service = ProductService(db)
    success = product_service.delete_product(product_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return {"message": "Product deleted successfully"}
