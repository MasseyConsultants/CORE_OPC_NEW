"""
Product service
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from typing import List, Optional

class ProductService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_products(
        self, 
        customer_id: Optional[str] = None,
        active_only: bool = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[Product]:
        """
        Get products with optional filtering
        """
        query = self.db.query(Product)
        
        if customer_id:
            query = query.filter(Product.customerId == customer_id)
        
        if active_only:
            query = query.filter(Product.active == True)
        
        return query.offset(skip).limit(limit).all()
    
    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """
        Get product by ID
        """
        return self.db.query(Product).filter(Product.id == product_id).first()
    
    def get_product_by_sku(self, sku: str, customer_id: Optional[str] = None) -> Optional[Product]:
        """
        Get product by SKU
        """
        query = self.db.query(Product).filter(Product.sku == sku)
        
        if customer_id:
            query = query.filter(Product.customerId == customer_id)
        
        return query.first()
    
    def create_product(self, product_data: ProductCreate) -> Product:
        """
        Create a new product
        """
        # Check if product with same SKU already exists
        existing_product = self.get_product_by_sku(product_data.sku, product_data.customerId)
        if existing_product:
            raise ValueError(f"Product with SKU {product_data.sku} already exists for customer {product_data.customerId}")
        
        db_product = Product(**product_data.dict())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product
    
    def update_product(self, product_id: int, product_data: ProductUpdate) -> Optional[Product]:
        """
        Update product
        """
        product = self.get_product_by_id(product_id)
        if not product:
            return None
        
        # Update fields if provided
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        self.db.commit()
        self.db.refresh(product)
        return product
    
    def delete_product(self, product_id: int) -> bool:
        """
        Soft delete product (set active = False)
        """
        product = self.get_product_by_id(product_id)
        if not product:
            return False
        
        product.active = False
        self.db.commit()
        return True
    
    def get_products_count(self, customer_id: Optional[str] = None, active_only: bool = True) -> int:
        """
        Get total count of products
        """
        query = self.db.query(Product)
        
        if customer_id:
            query = query.filter(Product.customerId == customer_id)
        
        if active_only:
            query = query.filter(Product.active == True)
        
        return query.count()
