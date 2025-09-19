"""
Authentication service
"""

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserLogin, UserCreate, UserUpdate
from app.core.security import verify_password, get_password_hash, create_access_token
from datetime import timedelta
from app.core.config import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def authenticate_user(self, email: str, password: str) -> User | None:
        """
        Authenticate a user with email and password
        """
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user
    
    def create_user(self, user_data: UserCreate) -> User:
        """
        Create a new user
        """
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            password=hashed_password,
            name=user_data.name,
            role=user_data.role,
            customerId=user_data.customerId
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def get_user_by_email(self, email: str) -> User | None:
        """
        Get user by email
        """
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_id(self, user_id: str) -> User | None:
        """
        Get user by ID
        """
        return self.db.query(User).filter(User.id == user_id).first()
    
    def update_user(self, user_id: str, user_data: UserUpdate) -> User | None:
        """
        Update user information
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Update fields if provided
        if user_data.email is not None:
            user.email = user_data.email
        if user_data.name is not None:
            user.name = user_data.name
        if user_data.role is not None:
            user.role = user_data.role
        if user_data.customerId is not None:
            user.customerId = user_data.customerId
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def create_access_token_for_user(self, user: User) -> str:
        """
        Create access token for user
        """
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id, "role": user.role},
            expires_delta=access_token_expires
        )
        return access_token
