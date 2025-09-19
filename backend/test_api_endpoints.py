#!/usr/bin/env python3
"""
Test FastAPI Authentication Endpoints
"""

import requests
import json
import time
import subprocess
import sys
import os
from threading import Thread

def start_server():
    """Start the FastAPI server in background"""
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"], 
                      cwd=os.path.dirname(os.path.abspath(__file__)), 
                      check=True)
    except subprocess.CalledProcessError as e:
        print(f"Server start error: {e}")

def test_api_endpoints():
    """Test the authentication API endpoints"""
    print("🚀 Testing FastAPI Authentication Endpoints")
    print("=" * 60)
    
    # Start server in background
    print("1. Starting FastAPI server...")
    server_thread = Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Wait for server to start
    print("   Waiting for server to start...")
    time.sleep(3)
    
    base_url = "http://localhost:8001"
    
    try:
        # Test 1: Health check
        print("\n2. Testing health check...")
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check successful!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
        
        # Test 2: Root endpoint
        print("\n3. Testing root endpoint...")
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint successful!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
        
        # Test 3: Login with robert@ait.com
        print("\n4. Testing login with robert@ait.com...")
        login_data = {
            "email": "robert@ait.com",
            "password": "!qazZSE$567"
        }
        
        response = requests.post(f"{base_url}/api/v1/auth/login", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful!")
            token_data = response.json()
            print(f"   Token type: {token_data['token_type']}")
            print(f"   Access token: {token_data['access_token'][:50]}...")
            
            # Test 4: Get user info with token
            print("\n5. Testing get user info...")
            headers = {"Authorization": f"Bearer {token_data['access_token']}"}
            response = requests.get(f"{base_url}/api/v1/auth/me", headers=headers)
            
            if response.status_code == 200:
                print("✅ Get user info successful!")
                user_data = response.json()
                print(f"   User: {user_data['name']} ({user_data['email']})")
                print(f"   Role: {user_data['role']}")
                print(f"   Customer ID: {user_data['customerId']}")
            else:
                print(f"❌ Get user info failed: {response.status_code}")
                print(f"   Response: {response.text}")
            
            # Test 5: Token refresh
            print("\n6. Testing token refresh...")
            response = requests.post(f"{base_url}/api/v1/auth/refresh", headers=headers)
            
            if response.status_code == 200:
                print("✅ Token refresh successful!")
                new_token_data = response.json()
                print(f"   New token: {new_token_data['access_token'][:50]}...")
            else:
                print(f"❌ Token refresh failed: {response.status_code}")
                print(f"   Response: {response.text}")
        
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
        
        print(f"\n🎉 API ENDPOINT TESTING COMPLETE!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on port 8001")
    except Exception as e:
        print(f"❌ Error during API testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_endpoints()
