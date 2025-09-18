# CORE OPC Calculator - Product Requirements Document (PDR)

## Version 2.0 - With Development Guardrails

---

## 🎯 PROJECT OVERVIEW

**Project Name:** CORE OPC Calculator (Core Overpack Calculator)  
**Purpose:** A web-based shipping calculator that uses 3D Bin Packing Problem (BPP) algorithms to optimally pack products into overpack boxes and calculate shipping rates for Tyson Foods and other customers.  
**Target Users:** Tyson Foods logistics team, AIT Admin users, and other customers who need optimal shipping calculations.

---

## 🏗️ MANDATORY SYSTEM ARCHITECTURE

### **Technology Stack (FIXED - NO CHANGES ALLOWED)**

- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI + Python + SQLAlchemy
- **Database:** PostgreSQL
- **Authentication:** JWT-based
- **Deployment:**
  - Frontend: Hostinger static hosting (coreopc.robertwmassey.com)
  - Backend: VPS API server (api.robertwmassey.com:8002)
  - Database: PostgreSQL on VPS

### **File Structure (MANDATORY - NO DEVIATIONS)**

```
CORE_OPC_Alpha_1/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   └── customer.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── auth.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── api.py
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── enhanced_tyson_calculator.py
│   │   │       └── analytics.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── packing_algorithm.py
│   │   └── auth/
│   │       ├── __init__.py
│   │       └── jwt.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── calculator/
    │   │   ├── dashboard/
    │   │   ├── layout/
    │   │   └── admin/
    │   ├── services/
    │   ├── contexts/
    │   └── types/
    ├── package.json
    └── vite.config.ts
```

---

## 🛡️ DEVELOPMENT GUARDRAILS

### **1. MANDATORY DEVELOPMENT RULES**

- **NEVER** create files outside the specified directory structure
- **ALWAYS** include `__init__.py` files in every Python directory
- **NEVER** modify existing working code without explicit permission
- **ALWAYS** test imports before creating new files
- **NEVER** create duplicate functionality
- **ALWAYS** use proper error handling with HTTPException
- **NEVER** hardcode values - use environment variables
- **ALWAYS** validate input data with Pydantic schemas

### **2. BACKEND DEVELOPMENT CONSTRAINTS**

- **File Creation:** Only create files in the `app/` directory structure
- **Import Testing:** Test all imports before proceeding
- **Error Handling:** Use FastAPI HTTPException for all errors
- **Database:** Use SQLAlchemy ORM only, no raw SQL
- **Authentication:** JWT only, no other auth methods
- **API Design:** RESTful endpoints with proper HTTP status codes

### **3. FRONTEND DEVELOPMENT CONSTRAINTS**

- **Components:** Only create in `src/components/` directory
- **TypeScript:** Use interfaces for all data structures
- **Error Handling:** Proper loading states and error messages
- **API Calls:** Use environment variables for URLs
- **Validation:** Client-side validation before API calls

### **4. DATABASE CONSTRAINTS**

- **Schema:** Use existing table schemas, no modifications without permission
- **ORM:** SQLAlchemy models only, no raw SQL
- **Relationships:** Proper foreign key relationships
- **Migrations:** Use Alembic for schema changes

### **5. 3D BPP ALGORITHM CONSTRAINTS**

- **Strategies:** Maintain BFD, FFD, BLF strategies
- **Data Structures:** Use existing dataclasses
- **Cost Optimization:** Maintain smallest box first logic
- **Testing:** Test with real product data only

---

## 🎯 CORE FUNCTIONALITY REQUIREMENTS

### **1. 3D Bin Packing Problem (BPP) Algorithm**

```python
# MANDATORY DATA STRUCTURES
@dataclass
class Item:
    id: str
    name: str
    length: float
    width: float
    height: float
    weight: float
    quantity: int

@dataclass
class Box:
    id: str
    name: str
    length: float
    width: float
    height: float
    max_weight: float
    cost: float

@dataclass
class PackedBox:
    box: Box
    items: List[Tuple[Item, int]]
    total_weight: float
    total_volume: float
    utilization: float
    packing_efficiency: float

@dataclass
class PackingResult:
    packed_boxes: List[PackedBox]
    total_boxes: int
    total_weight: float
    total_cost: float
    overall_efficiency: float
    overflow_items: List[Tuple[Item, int]]
    recommendations: List[PackingRecommendation]
```

### **2. MANDATORY API ENDPOINTS**

```python
# Authentication
POST /api/v1/auth/login
GET /api/v1/auth/me

# Calculator
GET /api/v1/products/
GET /api/v1/products/overpack-boxes/
POST /api/v1/enhanced-tyson-calculator/calculate-enhanced-shipping

# Admin
GET /api/v1/users/
GET /api/v1/customers/
GET /api/v1/analytics/overview
GET /api/v1/analytics/products-usage
GET /api/v1/analytics/recent-activity
```

### **3. MANDATORY DATABASE SCHEMA**

```sql
-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    sku VARCHAR(255),
    length FLOAT,
    width FLOAT,
    height FLOAT,
    weight FLOAT,
    "customerId" VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Overpack Boxes Table
CREATE TABLE overpack_boxes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    length FLOAT,
    width FLOAT,
    height FLOAT,
    "maxWeight" FLOAT,
    cost FLOAT DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    "customerId" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(255) DEFAULT 'USER',
    "customerId" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    "zipCode" VARCHAR(255),
    country VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🚫 FORBIDDEN ACTIONS

### **File Management**

- ❌ Creating files outside the specified directory structure
- ❌ Deleting working files without backup
- ❌ Modifying existing working code without permission
- ❌ Creating duplicate files or functionality

### **Code Quality**

- ❌ Hardcoding sensitive information
- ❌ Using frameworks not specified in architecture
- ❌ Creating files with commands that might fail
- ❌ Leaving TODO comments in production code

### **Database**

- ❌ Modifying existing table schemas without permission
- ❌ Writing raw SQL queries instead of using ORM
- ❌ Creating tables without proper relationships

### **Deployment**

- ❌ Deploying without proper testing
- ❌ Deploying without proper configuration
- ❌ Deploying without database migration

---

## ✅ MANDATORY SUCCESS CRITERIA

### **Development Phase**

1. ✅ All files created in correct locations
2. ✅ All imports work without errors
3. ✅ Backend starts without errors
4. ✅ Frontend builds successfully
5. ✅ Database connections work
6. ✅ Authentication works

### **Functionality Phase**

1. ✅ Calculator functionality works
2. ✅ Admin functionality works
3. ✅ Complete user workflow works
4. ✅ 3D BPP algorithm works correctly
5. ✅ Real data integration works

### **Deployment Phase**

1. ✅ Production configuration works
2. ✅ Database migration successful
3. ✅ Frontend deployed to Hostinger
4. ✅ Backend deployed to VPS
5. ✅ Complete system accessible

---

## 🔧 EMERGENCY PROCEDURES

### **If Something Breaks**

1. **STOP** immediately
2. Check what was changed
3. Restore from backup if available
4. Test the system step by step
5. Only proceed when system is working
6. Document what went wrong

### **Recovery Checklist**

1. ✅ Verify file structure is correct
2. ✅ Check all imports work
3. ✅ Test backend startup
4. ✅ Test frontend build
5. ✅ Test database connection
6. ✅ Test authentication
7. ✅ Test calculator functionality
8. ✅ Test admin functionality

---

## 📋 MANDATORY DEVELOPMENT CHECKLIST

### **Before Starting Development**

- [ ] Read and understand the PDR
- [ ] Verify existing code is working
- [ ] Check file structure matches requirements
- [ ] Test all imports work correctly
- [ ] Verify database connections
- [ ] Test API endpoints
- [ ] Check frontend builds successfully
- [ ] Verify authentication works
- [ ] Test complete user workflow

### **During Development**

- [ ] Follow the directory structure exactly
- [ ] Test each file creation
- [ ] Verify imports work
- [ ] Test functionality incrementally
- [ ] Use proper error handling
- [ ] Validate all input data
- [ ] Test with real data

### **Before Deployment**

- [ ] All tests pass
- [ ] No hardcoded values
- [ ] Proper error handling
- [ ] Security measures in place
- [ ] Performance optimized
- [ ] Documentation complete

---

**Remember: This system was working before. The goal is to restore functionality, not add new features. Follow the guardrails strictly to prevent the issues that occurred previously.**
