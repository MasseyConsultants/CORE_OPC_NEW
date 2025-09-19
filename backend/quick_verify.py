#!/usr/bin/env python3
"""
Quick Database Verification Script
"""

import psycopg
from dotenv import load_dotenv
import os

def main():
    load_dotenv()
    conn = psycopg.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    print("🗄️ CORE OPC Database Quick Verification")
    print("=" * 60)
    
    # Check key tables
    tables_to_check = [
        'customers',
        'products', 
        'overpack_boxes',
        'users',
        'shipping_calculations',
        'rate_quote_cache',
        'shipping_rates',
        'system_settings'
    ]
    
    for table in tables_to_check:
        try:
            print(f"\n📋 {table.upper()}:")
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            count = cur.fetchone()[0]
            print(f"  Count: {count}")
            
            if count > 0:
                cur.execute(f"SELECT * FROM {table} LIMIT 3")
                rows = cur.fetchall()
                for i, row in enumerate(rows, 1):
                    print(f"  Row {i}: {row}")
            else:
                print("  No data")
                
        except Exception as e:
            print(f"  Error: {e}")
    
    conn.close()
    print("\n✅ Verification complete!")

if __name__ == "__main__":
    main()
