#!/usr/bin/env python3
"""
Test Complete JWT Authentication Flow with robert@ait.com
"""

from app.db.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import UserLogin
from app.core.security import verify_token

def test_complete_auth():
    print("🔐 Complete JWT Authentication Test with robert@ait.com")
    print("=" * 60)
    
    db = next(get_db())
    auth_service = AuthService(db)
    
    try:
        # Test 1: User lookup
        print("1. Looking up robert@ait.com...")
        user = auth_service.get_user_by_email("robert@ait.com")
        if user:
            print(f"✅ Found user: {user.name} ({user.email}) - {user.role}")
        else:
            print("❌ User not found")
            return
        
        # Test 2: Authentication
        print("\n2. Testing authentication...")
        auth_user = auth_service.authenticate_user("robert@ait.com", "!qazZSE$567")
        if auth_user:
            print("✅ Authentication successful!")
            print(f"   Authenticated user: {auth_user.name}")
        else:
            print("❌ Authentication failed")
            return
        
        # Test 3: JWT Token Creation
        print("\n3. Creating JWT token...")
        token = auth_service.create_access_token_for_user(auth_user)
        print(f"✅ JWT token created successfully!")
        print(f"   Token (first 50 chars): {token[:50]}...")
        
        # Test 4: Token Verification
        print("\n4. Verifying JWT token...")
        token_data = verify_token(token)
        if token_data:
            print("✅ Token verification successful!")
            print(f"   Token payload:")
            print(f"     - sub (email): {token_data.get('sub')}")
            print(f"     - user_id: {token_data.get('user_id')}")
            print(f"     - role: {token_data.get('role')}")
            print(f"     - exp: {token_data.get('exp')}")
        else:
            print("❌ Token verification failed")
            return
        
        # Test 5: Test with UserLogin schema
        print("\n5. Testing with UserLogin schema...")
        login_data = UserLogin(email="robert@ait.com", password="!qazZSE$567")
        print(f"✅ UserLogin schema created: {login_data.email}")
        
        print(f"\n🎉 COMPLETE AUTHENTICATION TEST SUCCESSFUL!")
        print(f"\n📋 Ready for API testing:")
        print(f"   - Login endpoint: POST /api/v1/auth/login")
        print(f"   - User info endpoint: GET /api/v1/auth/me")
        print(f"   - Token refresh: POST /api/v1/auth/refresh")
        
    except Exception as e:
        print(f"❌ Error during authentication test: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()

if __name__ == "__main__":
    test_complete_auth()
