#!/usr/bin/env python3
"""
Test script to debug calculation endpoint
"""

import requests
import json

# Test data
test_payload = {
    "items": [
        {
            "id": "test-1",
            "name": "Test Product",
            "length": 10.0,
            "width": 8.0,
            "height": 6.0,
            "weight": 2.0,
            "quantity": 1
        }
    ],
    "destination_zip": "90210",
    "service_level": "overnight",
    "origin_zip": "60540",
    "customer_id": "ait"
}

# Test the endpoint
url = "http://localhost:8002/api/v1/calculations/calculate"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN_HERE"  # You'll need to get a real token
}

print("Testing calculation endpoint...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(test_payload, indent=2)}")

try:
    response = requests.post(url, json=test_payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
