#!/usr/bin/env python3
"""
Comprehensive Database Verification Script
Examines all tables and retrieves first 10 records from each table
"""

import psycopg
from dotenv import load_dotenv
import os
import json
from datetime import datetime

def test_database_connection():
    """Test basic database connection"""
    print("🔌 Testing database connection...")
    load_dotenv()
    
    try:
        conn = psycopg.connect(os.getenv('DATABASE_URL'))
        print("✅ Database connection successful!")
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def get_all_tables(conn):
    """Get all tables in the database"""
    print("\n📋 Getting all database tables...")
    
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    
    table_names = [table[0] for table in tables]
    print(f"Found {len(table_names)} tables:")
    for i, table in enumerate(table_names, 1):
        print(f"  {i:2d}. {table}")
    
    return table_names

def get_table_info(conn, table_name):
    """Get detailed information about a table"""
    cur = conn.cursor()
    
    # Get column information
    cur.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = %s 
        ORDER BY ordinal_position;
    """, (table_name,))
    
    columns = cur.fetchall()
    
    # Get row count
    cur.execute(f"SELECT COUNT(*) FROM {table_name};")
    count = cur.fetchone()[0]
    
    return columns, count

def get_sample_data(conn, table_name, limit=10):
    """Get sample data from a table"""
    cur = conn.cursor()
    
    try:
        cur.execute(f"SELECT * FROM {table_name} LIMIT {limit};")
        rows = cur.fetchall()
        
        # Get column names
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = %s 
            ORDER BY ordinal_position;
        """, (table_name,))
        column_names = [col[0] for col in cur.fetchall()]
        
        return rows, column_names
    except Exception as e:
        return None, f"Error: {e}"

def format_value(value):
    """Format a value for display"""
    if value is None:
        return "NULL"
    elif isinstance(value, datetime):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    elif isinstance(value, (dict, list)):
        return json.dumps(value, indent=2, default=str)
    elif isinstance(value, str) and len(value) > 100:
        return value[:100] + "..."
    else:
        return str(value)

def examine_table(conn, table_name, index):
    """Examine a single table in detail"""
    print(f"\n{'='*80}")
    print(f"🔍 TABLE {index}: {table_name}")
    print(f"{'='*80}")
    
    try:
        # Get table info
        columns, count = get_table_info(conn, table_name)
        
        print(f"📊 Row Count: {count:,}")
        print(f"📋 Columns ({len(columns)}):")
        for i, col in enumerate(columns, 1):
            nullable = "NULL" if col[2] == "YES" else "NOT NULL"
            default = f" DEFAULT {col[3]}" if col[3] else ""
            print(f"  {i:2d}. {col[0]:<25} {col[1]:<20} {nullable}{default}")
        
        # Get sample data
        print(f"\n📊 Sample Data (first 10 rows):")
        rows, column_names = get_sample_data(conn, table_name, 10)
        
        if isinstance(rows, list):
            if rows:
                print(f"  Columns: {', '.join(column_names)}")
                print(f"  {'-'*80}")
                for i, row in enumerate(rows, 1):
                    print(f"  Row {i:2d}:")
                    for j, (col_name, value) in enumerate(zip(column_names, row)):
                        formatted_value = format_value(value)
                        print(f"    {col_name}: {formatted_value}")
                    print(f"  {'-'*40}")
            else:
                print("  No data found")
        else:
            print(f"  {rows}")
            
    except Exception as e:
        print(f"❌ Error examining table {table_name}: {e}")

def main():
    """Main verification function"""
    print("🗄️ CORE OPC Database Verification")
    print("=" * 80)
    print("This script will examine ALL tables and show first 10 records from each")
    print("=" * 80)
    
    # Test connection
    conn = test_database_connection()
    if not conn:
        return
    
    try:
        # Get all tables
        tables = get_all_tables(conn)
        
        # Examine each table
        for i, table_name in enumerate(tables, 1):
            examine_table(conn, table_name, i)
        
        print(f"\n{'='*80}")
        print("✅ DATABASE VERIFICATION COMPLETE!")
        print(f"📊 Examined {len(tables)} tables")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
    
    finally:
        conn.close()
        print("\n🔌 Database connection closed.")

if __name__ == "__main__":
    main()
