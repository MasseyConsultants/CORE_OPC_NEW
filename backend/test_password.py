#!/usr/bin/env python3
"""
Test password verification with robert@ait.com
"""

from app.db.database import get_db
from app.models.user import User
from app.core.security import verify_password, get_password_hash

def test_password():
    db = next(get_db())
    user = db.query(User).filter(User.email == 'robert@ait.com').first()
    
    print(f"User: {user.name} ({user.email})")
    print(f"Password hash: {user.password[:50]}...")
    
    # Test common passwords
    test_passwords = ['password', 'admin', '123456', 'robert', 'ait', 'Password123']
    print("\nTesting common passwords:")
    for pwd in test_passwords:
        result = verify_password(pwd, user.password)
        print(f"  {pwd}: {result}")
    
    # Test the provided password
    print(f"\nTesting provided password:")
    result = verify_password('!qazZSE$567', user.password)
    print(f"  !qazZSE$567: {result}")
    
    # Create a new hash for the provided password
    print(f"\nCreating new hash for provided password:")
    new_hash = get_password_hash('!qazZSE$567')
    print(f"  New hash: {new_hash[:50]}...")
    
    # Test if the new hash works
    test_new_hash = verify_password('!qazZSE$567', new_hash)
    print(f"  New hash verification: {test_new_hash}")
    
    db.close()

if __name__ == "__main__":
    test_password()
