#!/usr/bin/env python3
"""
Test JWT Authentication with Real Database Users
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import UserLogin
from app.core.security import verify_password, create_access_token, verify_token
from sqlalchemy.orm import Session

def test_real_user_authentication():
    """Test authentication with real database users"""
    print("🔐 Testing JWT Authentication with Real Database Users")
    print("=" * 60)
    
    try:
        # Get database session
        db = next(get_db())
        auth_service = AuthService(db)
        
        # Test 1: Check if robert@ait.com exists
        print("1. Checking if robert@ait.com exists in database...")
        user = auth_service.get_user_by_email("robert@ait.com")
        if user:
            print(f"✅ Found user: {user.name} ({user.email}) - {user.role}")
            print(f"   User ID: {user.id}")
            print(f"   Customer ID: {user.customerId}")
            print(f"   Created: {user.createdAt}")
        else:
            print("❌ User robert@ait.com not found")
            # Let's check what users exist
            print("\n   Available users in database:")
            all_users = db.query(user.__class__).all()
            for u in all_users:
                print(f"   - {u.name} ({u.email}) - {u.role}")
            return
        
        # Test 2: Test password verification
        print(f"\n2. Testing password verification for {user.email}...")
        test_password = "!qazZSE$567"
        
        # Check if password matches
        password_valid = verify_password(test_password, user.password)
        if password_valid:
            print("✅ Password verification successful!")
        else:
            print("❌ Password verification failed")
            print("   This could mean:")
            print("   - Password is incorrect")
            print("   - Password hash format is different")
            print("   - User was created with different hashing method")
        
        # Test 3: Test authentication service
        print(f"\n3. Testing authentication service...")
        auth_user = auth_service.authenticate_user(user.email, test_password)
        if auth_user:
            print("✅ Authentication service successful!")
            print(f"   Authenticated user: {auth_user.name}")
        else:
            print("❌ Authentication service failed")
        
        # Test 4: Test JWT token creation
        print(f"\n4. Testing JWT token creation...")
        try:
            token = auth_service.create_access_token_for_user(user)
            print(f"✅ JWT token created successfully!")
            print(f"   Token (first 50 chars): {token[:50]}...")
            
            # Test token verification
            print(f"\n5. Testing JWT token verification...")
            token_data = verify_token(token)
            if token_data:
                print("✅ Token verification successful!")
                print(f"   Token payload: {token_data}")
            else:
                print("❌ Token verification failed")
                
        except Exception as e:
            print(f"❌ Token creation failed: {e}")
        
        # Test 5: Test with other users
        print(f"\n6. Testing with other users in database...")
        all_users = db.query(user.__class__).all()
        for u in all_users:
            print(f"   - {u.name} ({u.email}) - {u.role}")
        
        print(f"\n✅ JWT Authentication test completed!")
        
    except Exception as e:
        print(f"❌ Error during authentication test: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()

if __name__ == "__main__":
    test_real_user_authentication()
