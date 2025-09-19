"""
Customer service
"""

from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate
from typing import List, Optional

class CustomerService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_customers(self, active_only: bool = True) -> List[Customer]:
        """
        Get all customers
        """
        query = self.db.query(Customer)
        
        if active_only:
            query = query.filter(Customer.active == True)
        
        return query.all()
    
    def get_customer_by_id(self, customer_id: str) -> Optional[Customer]:
        """
        Get customer by ID
        """
        return self.db.query(Customer).filter(Customer.id == customer_id).first()
    
    def create_customer(self, customer_data: CustomerCreate) -> Customer:
        """
        Create a new customer
        """
        # Check if customer with same ID already exists
        existing_customer = self.get_customer_by_id(customer_data.name)
        if existing_customer:
            raise ValueError(f"Customer with ID {customer_data.name} already exists")
        
        db_customer = Customer(**customer_data.dict())
        self.db.add(db_customer)
        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer
    
    def update_customer(self, customer_id: str, customer_data: CustomerUpdate) -> Optional[Customer]:
        """
        Update customer
        """
        customer = self.get_customer_by_id(customer_id)
        if not customer:
            return None
        
        # Update fields if provided
        update_data = customer_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(customer, field, value)
        
        self.db.commit()
        self.db.refresh(customer)
        return customer
    
    def delete_customer(self, customer_id: str) -> bool:
        """
        Soft delete customer (set active = False)
        """
        customer = self.get_customer_by_id(customer_id)
        if not customer:
            return False
        
        customer.active = False
        self.db.commit()
        return True
