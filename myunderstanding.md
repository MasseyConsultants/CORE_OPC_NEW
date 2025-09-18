# CORE OPC Calculator - My Understanding & Project Analysis

## 🎯 PROJECT OVERVIEW

**Project Name:** CORE OPC Calculator (Core Overpack Calculator)  
**Primary Client:** AIT World Wide Logistics  
**First Customer Implementation:** Tyson Foods  
**Purpose:** A web-based shipping calculator that uses 3D Bin Packing Problem (BPP) algorithms to optimally pack products into overpack boxes and calculate shipping rates for AIT's customers.  
**Target Users:** AIT logistics team, Tyson Foods logistics team, and other future customers who need optimal shipping calculations.

**GitHub Repository:** https://github.com/MasseyConsultants/CORE_OPC_NEW.git  
**Current Status:** Empty repository, ready for initial commit  
**Platform:** Windows machine with existing PostgreSQL database (populated with data)

---

## 🏗️ MANDATORY SYSTEM ARCHITECTURE

### **Technology Stack (FIXED - NO CHANGES ALLOWED)**

#### Backend (Python/FastAPI)

- **Python**: 3.11+ (compatible with psycopg2-binary)
- **FastAPI**: 0.110.0
- **SQLAlchemy**: 2.0.36
- **PostgreSQL**: 15 (port 5433) - **ALREADY BUILT AND POPULATED**
- **Pydantic**: 2.9.2 (use `model_config` not `class Config`)
- **Alembic**: 1.13.2 for migrations
- **JWT**: python-jose[cryptography]==3.3.0
- **Password Hashing**: passlib[bcrypt]==1.7.4 (use bcrypt==4.0.1 for compatibility)

#### Frontend (React/Vite)

- **React**: 18.3.1 (NOT 19.x - compatibility issues with Three.js)
- **Vite**: 5.4.10
- **TypeScript**: 5.6.3
- **Three.js**: 0.145.0 (compatible with React 18.3.1)
- **@react-three/fiber**: 8.8.7
- **@react-three/drei**: 9.32.4
- **Tailwind CSS**: 3.4.17
- **React Router**: 6.28.1

#### Testing

- **Backend**: pytest==8.3.4, pytest-asyncio==0.24.0
- **Frontend**: vitest==1.6.0, @testing-library/react==14.2.1
- **E2E**: playwright==1.40.1

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
- **Column Naming:** Use **camelCase** for database columns (NOT snake_case)

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

### **3. MANDATORY DATABASE SCHEMA (ALREADY BUILT)**

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

## 🎨 UI/UX GUIDELINES

### **Layout Requirements**

- **Full-width application**: Must fill entire browser window (100vw, 100vh)
- **No scrollbars**: Use `overflow-hidden` on main containers
- **Enterprise appearance**: Professional, clean, modern design
- **Responsive**: Mobile-first approach with desktop enhancements

### **Component Structure**

```tsx
// Use proper component patterns
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return <div className="w-full h-full">{/* Component content */}</div>;
};
```

### **Styling Guidelines**

- Use Tailwind CSS classes
- Apply `w-full h-full` to main containers
- Use `enterprise-table` class for data tables
- Implement proper loading states
- Use consistent color scheme (blue primary, red for Tyson branding)

---

## 🔧 ENVIRONMENT CONFIGURATION

### **Backend Environment (.env)**

```env
DATABASE_URL=postgresql://postgres:!A9ff5a3c5@localhost:5433/CORE_OPC
DB_HOST=localhost
DB_PORT=5433
DB_NAME=CORE_OPC
DB_USER=postgres
DB_PASSWORD=!A9ff5a3c5
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:5174"]
ENVIRONMENT=development
DEBUG=true
```

### **Frontend Environment (.env)**

```env
VITE_API_BASE_URL=http://localhost:8001
VITE_APP_NAME=CORE OPC Alpha 1
VITE_APP_VERSION=1.0.0
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

## 🔄 SESSION PERSISTENCE STRATEGY

### **Git Version Control**

- **Repository**: https://github.com/MasseyConsultants/CORE_OPC_NEW.git
- **Strategy**: Commit frequently with descriptive messages
- **Branches**: Use feature branches for development
- **Backup**: Push to remote repository regularly

### **Development Workflow**

1. **Incremental Development**: Build and test each component completely
2. **Frequent Commits**: Commit working code at each milestone
3. **Documentation**: Keep development log of progress
4. **Testing**: Test each component before moving to next

### **Session Recovery Checklist**

1. ✅ Pull latest changes from repository
2. ✅ Verify file structure is correct
3. ✅ Check all imports work
4. ✅ Test backend startup
5. ✅ Test frontend build
6. ✅ Test database connection
7. ✅ Test authentication
8. ✅ Test calculator functionality

---

## 📋 DEVELOPMENT PRIORITIES

### **Phase 1: Project Setup**

1. Initialize git repository
2. Set up project structure
3. Configure environment variables
4. Test database connection
5. Create basic API endpoints

### **Phase 2: Core Features**

1. User authentication and management
2. Product catalog management
3. Basic shipping calculator
4. Database integration

### **Phase 3: Advanced Features**

1. Tyson tariff calculations
2. Packing optimization algorithm
3. Advanced UI components
4. Comprehensive testing

### **Phase 4: Production Features**

1. Performance optimization
2. Security hardening
3. Monitoring and logging
4. Deployment automation

---

## 🎯 KEY UPDATES FROM DISCUSSION

1. **Business Context**: AIT World Wide Logistics is the primary client, Tyson Foods is the first customer
2. **Database Status**: Already built and populated with data on developer's machine
3. **Platform**: Windows machine
4. **Git Repository**: https://github.com/MasseyConsultants/CORE_OPC_NEW.git (currently empty)
5. **Session Management**: Need to implement git version control to avoid losing work between sessions

---

## 🔍 NEXT STEPS

1. **Initialize Git Repository**: Set up version control with the GitHub repository
2. **Examine Database**: Connect to existing PostgreSQL database and examine structure/data
3. **Set Up Project Structure**: Create the mandatory directory structure
4. **Configure Environment**: Set up environment variables and configuration files
5. **Test Database Connection**: Verify connection to existing database
6. **Begin Development**: Start with Phase 1 development priorities

---

**Remember**: This is a professional enterprise application for AIT World Wide Logistics. Code quality, security, and maintainability are paramount. Always test thoroughly and follow established patterns. The database is already built and populated, so we're building the application around existing data.
