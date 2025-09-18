# CORE_OPC Alpha 1 Setup Prompts

## Environment Setup Commands and Configurations

## ⚠️ **IMPORTANT: Windows Users**

This document contains commands for multiple operating systems. **Windows users should use the Windows-specific commands** marked with `cmd` or `powershell` sections. The bash commands are for Linux/macOS users.

### **Windows-Specific Notes:**

- Use **Command Prompt (cmd)** or **PowerShell** instead of bash
- Use backslashes `\` instead of forward slashes `/` for paths
- Use `echo` instead of `cat` for creating files
- Use `--legacy-peer-deps` flag for npm when encountering dependency conflicts
- React 18.3.1 is used instead of React 19 to avoid Three.js compatibility issues

### **Version Compatibility Notes:**

- **React 18.3.1** - Latest stable React 18 version
- **Three.js 0.145.0** - Compatible with React 18.3.1
- **@react-three/fiber 8.8.7** - Compatible with React 18.3.1 and Three.js 0.145.0
- **@react-three/drei 9.32.4** - Compatible with React 18.3.1 and Three.js 0.145.0
- **Vite 5.4.10** - Stable version compatible with React 18
- **Vitest 1.6.0** - Stable version compatible with React 18
- **Testing Library 14.2.1** - Compatible with React 18

### **Quick Windows Setup:**

```cmd
# 1. Create directories
mkdir CORE_OPC_Alpha_1 && cd CORE_OPC_Alpha_1
mkdir frontend backend docs scripts tests data config reports

# 2. Setup backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi==0.110.0 uvicorn==0.30.6 sqlalchemy==2.0.36 psycopg2-binary==2.9.9 alembic==1.13.2 pydantic==2.9.2 python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 python-multipart==0.0.12 python-dotenv==1.0.1 pandas==2.2.3 openpyxl==3.1.5 pytest==8.3.4 pytest-asyncio==0.24.0 pytest-cov==6.0.0 pytest-html==4.1.1 pytest-xdist==3.6.0 pytest-mock==3.14.0 pytest-clarity==1.0.1 factory-boy==3.3.1 faker==30.0.0 httpx==0.27.2 freezegun==1.4.0 responses==0.25.0

# 3. Setup frontend
cd ..\frontend
npm init -y
npm install react@18.3.1 react-dom@18.3.1 @types/react@18.3.12 @types/react-dom@18.3.1
npm install @vitejs/plugin-react@4.3.4 vite@5.4.10 typescript@5.6.3 @types/node@20.11.0
npm install react-router-dom@6.28.1 @tanstack/react-query@5.59.16 axios@1.7.7
npm install lucide-react@0.468.0 three@0.145.0 @types/three@0.145.0
npm install @react-three/fiber@8.8.7 @react-three/drei@9.32.4
npm install -D @types/node@20.11.0 autoprefixer@10.4.20 postcss@8.4.49 tailwindcss@3.4.17
npm install -D vitest@1.6.0 @testing-library/react@14.2.1 @testing-library/jest-dom@6.4.2 @testing-library/user-event@14.5.2 jsdom@24.0.0 @vitest/ui@1.6.0 @vitest/coverage-v8@1.6.0 c8@8.0.1 playwright@1.40.1 @playwright/test@1.40.1 msw@2.3.0 @faker-js/faker@8.4.1
```

### **Troubleshooting Common Issues:**

#### **1. React Version Conflicts (Three.js Compatibility)**

```cmd
# If you get React version conflicts with Three.js libraries:
npm uninstall react react-dom @types/react @types/react-dom
npm install react@18.3.1 react-dom@18.3.1 @types/react@18.3.12 @types/react-dom@18.3.1
npm install three@0.145.0 @react-three/fiber@8.8.7 @react-three/drei@9.32.4 @types/three@0.145.0
```

#### **2. Security Vulnerabilities**

```cmd
# Fix security vulnerabilities
npm audit fix

# If issues persist, force fix (use with caution)
npm audit fix --force
```

#### **3. Peer Dependency Conflicts**

```cmd
# Use compatible versions for Three.js packages
npm install three@0.145.0 @react-three/fiber@8.8.7 @react-three/drei@9.32.4 @types/three@0.145.0

# If issues persist, use legacy peer deps
npm install @react-three/fiber@8.8.7 @react-three/drei@9.32.4 --legacy-peer-deps

# Or install with force flag (use with caution)
npm install --force
```

#### **4. Clean Install (If All Else Fails)**

```cmd
# Remove everything and start fresh
rm -rf node_modules package-lock.json
npm install
```

### Phase 1: Project Structure Setup

#### 1. Create Project Directory Structure

**For Windows Command Prompt (cmd):**

```cmd
# Create main project directory
mkdir CORE_OPC_Alpha_1
cd CORE_OPC_Alpha_1

# Create frontend and backend directories
mkdir frontend backend docs scripts tests data config reports

# Create backend subdirectories
mkdir backend\app backend\app\api backend\app\api\v1 backend\app\core backend\app\models
mkdir backend\app\schemas backend\app\services backend\app\utils backend\app\auth
mkdir backend\app\db backend\app\migrations backend\app\tests

# Create frontend subdirectories
mkdir frontend\src frontend\src\components frontend\src\pages frontend\src\hooks
mkdir frontend\src\contexts frontend\src\utils frontend\src\types frontend\src\services
mkdir frontend\src\test frontend\src\test\components frontend\src\test\hooks
mkdir frontend\src\test\mocks frontend\e2e frontend\public frontend\assets frontend\styles

# Create shared types directory
mkdir types
```

**For PowerShell (Recommended):**

```powershell
# Create main project directory
New-Item -ItemType Directory -Path "CORE_OPC_Alpha_1"
Set-Location "CORE_OPC_Alpha_1"

# Create frontend and backend directories
New-Item -ItemType Directory -Path "frontend", "backend", "docs", "scripts", "tests", "data", "config", "reports"

# Create backend subdirectories
New-Item -ItemType Directory -Path "backend\app", "backend\app\api", "backend\app\api\v1", "backend\app\core", "backend\app\models", "backend\app\schemas", "backend\app\services", "backend\app\utils", "backend\app\auth", "backend\app\db", "backend\app\migrations", "backend\app\tests"

# Create frontend subdirectories
New-Item -ItemType Directory -Path "frontend\src", "frontend\src\components", "frontend\src\pages", "frontend\src\hooks", "frontend\src\contexts", "frontend\src\utils", "frontend\src\types", "frontend\src\services", "frontend\src\test", "frontend\src\test\components", "frontend\src\test\hooks", "frontend\src\test\mocks", "frontend\e2e", "frontend\public", "frontend\assets", "frontend\styles"

# Create shared types directory
New-Item -ItemType Directory -Path "types"
```

**For Linux/macOS (bash):**

```bash
# Create main project directory
mkdir CORE_OPC_Alpha_1
cd CORE_OPC_Alpha_1

# Create frontend and backend directories
mkdir frontend backend docs scripts tests data config reports

# Create backend subdirectories
mkdir -p backend/app/{api/v1,core,models,schemas,services,utils,auth,db,migrations,tests}

# Create frontend subdirectories
mkdir -p frontend/src/{components,pages,hooks,contexts,utils,types,services,test/{components,hooks,mocks}} frontend/{e2e,public,assets,styles}

# Create shared types directory
mkdir types
```

#### 2. Initialize Git Repository

**For Windows Command Prompt (cmd):**

```cmd
# Initialize git repository
git init

# Create .gitignore file (Windows cmd)
echo # Python > .gitignore
echo __pycache__/ >> .gitignore
echo *.py[cod] >> .gitignore
echo *$py.class >> .gitignore
echo *.so >> .gitignore
echo .Python >> .gitignore
echo build/ >> .gitignore
echo develop-eggs/ >> .gitignore
echo dist/ >> .gitignore
echo downloads/ >> .gitignore
echo eggs/ >> .gitignore
echo .eggs/ >> .gitignore
echo lib/ >> .gitignore
echo lib64/ >> .gitignore
echo parts/ >> .gitignore
echo sdist/ >> .gitignore
echo var/ >> .gitignore
echo wheels/ >> .gitignore
echo *.egg-info/ >> .gitignore
echo .installed.cfg >> .gitignore
echo *.egg >> .gitignore
echo MANIFEST >> .gitignore
echo. >> .gitignore
echo # Virtual Environment >> .gitignore
echo venv/ >> .gitignore
echo env/ >> .gitignore
echo ENV/ >> .gitignore
echo. >> .gitignore
echo # IDE >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo *.swp >> .gitignore
echo *.swo >> .gitignore
echo. >> .gitignore
echo # Environment variables >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.production >> .gitignore
echo. >> .gitignore
echo # Database >> .gitignore
echo *.db >> .gitignore
echo *.sqlite >> .gitignore
echo. >> .gitignore
echo # Logs >> .gitignore
echo *.log >> .gitignore
echo logs/ >> .gitignore
echo. >> .gitignore
echo # Frontend >> .gitignore
echo frontend/node_modules/ >> .gitignore
echo frontend/dist/ >> .gitignore
echo frontend/build/ >> .gitignore
echo frontend/.next/ >> .gitignore
echo. >> .gitignore
echo # OS >> .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore
echo. >> .gitignore
echo # Temporary files >> .gitignore
echo *.tmp >> .gitignore
echo *.temp >> .gitignore
```

**For PowerShell:**

```powershell
# Initialize git repository
git init

# Create .gitignore file (PowerShell)
@"
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual Environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.sqlite

# Logs
*.log
logs/

# Frontend
frontend/node_modules/
frontend/dist/
frontend/build/
frontend/.next/

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
"@ | Out-File -FilePath .gitignore -Encoding UTF8
```

**For Linux/macOS (bash):**

```bash
# Initialize git repository
git init

# Create .gitignore file
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual Environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.sqlite

# Logs
*.log
logs/

# Frontend
frontend/node_modules/
frontend/dist/
frontend/build/
frontend/.next/

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
EOF

# Initial commit
git add .
git commit -m "Initial project structure setup"
```

### Phase 2: Backend Setup (Python/FastAPI)

#### 1. Create Python Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (Linux/Mac)
source venv/bin/activate
```

#### 2. Install Python Dependencies

```bash
# Install core dependencies (Latest Stable Versions - 2024/2025)
pip install fastapi==0.110.0
pip install uvicorn==0.30.6
pip install sqlalchemy==2.0.36
pip install psycopg2-binary==2.9.9
pip install alembic==1.13.2
pip install pydantic==2.9.2
pip install python-jose[cryptography]==3.3.0
pip install passlib[bcrypt]==1.7.4
pip install python-multipart==0.0.12
pip install python-dotenv==1.0.1
pip install pandas==2.2.3
pip install openpyxl==3.1.5

# Testing dependencies (Latest Stable Versions)
pip install pytest==8.3.4
pip install pytest-asyncio==0.24.0
pip install pytest-cov==6.0.0
pip install pytest-html==4.1.1
pip install pytest-xdist==3.6.0
pip install pytest-mock==3.14.0
pip install pytest-clarity==1.0.1
pip install factory-boy==3.3.1
pip install faker==30.0.0
pip install httpx==0.27.2
pip install freezegun==1.4.0
pip install responses==0.25.0

# Create requirements.txt
pip freeze > requirements.txt
```

#### 3. Create Backend Configuration Files

**backend/app/core/config.py**

```python
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:!A9ff5a3c5@localhost:5433/CORE_OPC"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5433
    DB_NAME: str = "CORE_OPC"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "!A9ff5a3c5"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]

    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CORE OPC Alpha 1"

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
```

**backend/app/db/database.py**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**backend/app/main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "CORE OPC Alpha 1 API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

#### 4. Create Database Models

**backend/app/models/user.py**

```python
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    role = Column(String, default="USER")
    customer_id = Column(String, ForeignKey("customers.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="users")
    shipping_calculations = relationship("ShippingCalculation", back_populates="user")
```

**backend/app/models/product.py**

```python
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sku = Column(String)
    length = Column(Float)
    width = Column(Float)
    height = Column(Float)
    weight = Column(Float)
    active = Column(Boolean, default=True)
    customer_id = Column(String, default="tyson")
    dry_ice_volume = Column(Float, default=0)
    dry_ice_weight = Column(Float, default=0.5)
    priority = Column(Integer, default=1)
    requires_dry_ice = Column(Boolean, default=False)
    hold = Column(Boolean, default=False)
    on_hand_primary = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### 5. Create Authentication System

**backend/app/auth/jwt.py**

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
```

### Phase 3: Frontend Setup (React/Vite)

#### 1. Initialize React Project with Vite

```bash
cd frontend

# Create React project with Vite
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install React 18 and core dependencies (Compatible Versions)
npm install react@18.3.1
npm install react-dom@18.3.1
npm install @types/react@18.3.12
npm install @types/react-dom@18.3.1

# Install additional dependencies (React 18 Compatible Versions)
npm install react-router-dom@6.28.1
npm install @tanstack/react-query@5.59.16
npm install axios@1.7.7
npm install lucide-react@0.468.0
npm install clsx@2.1.1
npm install tailwind-merge@2.5.4
npm install @headlessui/react@2.1.4
npm install @heroicons/react@2.1.4
npm install react-hook-form@7.54.2
npm install @hookform/resolvers@3.9.1
npm install zod@3.23.8
npm install react-hot-toast@2.4.1

# Install Three.js libraries (React 18 Compatible Versions)
npm install three@0.145.0
npm install @react-three/fiber@8.8.7
npm install @react-three/drei@9.32.4
npm install @types/three@0.145.0

# Install dev dependencies (React 18 Compatible Versions)
npm install -D @types/node@20.11.0
npm install -D autoprefixer@10.4.20
npm install -D postcss@8.4.49
npm install -D tailwindcss@3.4.17
npm install -D @vitejs/plugin-react@4.3.4
npm install -D vite@5.4.10
npm install -D typescript@5.6.3

# Testing dependencies (React 18 Compatible Versions)
npm install -D vitest@1.6.0
npm install -D @testing-library/react@14.2.1
npm install -D @testing-library/jest-dom@6.4.2
npm install -D @testing-library/user-event@14.5.2
npm install -D jsdom@24.0.0
npm install -D @vitest/ui@1.6.0
npm install -D @vitest/coverage-v8@1.6.0
npm install -D c8@8.0.1
npm install -D playwright@1.40.1
npm install -D @playwright/test@1.40.1
npm install -D msw@2.3.0
npm install -D @faker-js/faker@8.4.1
```

#### 2. Configure Tailwind CSS

**frontend/tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        tyson: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

**frontend/postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### 3. Create Frontend Configuration

**frontend/src/config/api.ts**

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/v1/auth/login",
      REGISTER: "/api/v1/auth/register",
      REFRESH: "/api/v1/auth/refresh",
      LOGOUT: "/api/v1/auth/logout",
    },
    USERS: "/api/v1/users",
    PRODUCTS: "/api/v1/products",
    CART: "/api/v1/cart",
    PACKING: "/api/v1/packing",
    SHIPPING: "/api/v1/shipping",
    TARIFF: "/api/v1/tariff",
  },
};

export const APP_CONFIG = {
  NAME: "CORE OPC Alpha 1",
  VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE,
  DEBUG: import.meta.env.DEV,
};
```

**frontend/src/services/api.ts**

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_CONFIG } from "../config/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  public post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.api.post(url, data, config);
  }

  public put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.api.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }
}

export const apiService = new ApiService();
```

### Phase 4: Database Migration Setup

#### 1. Create Alembic Configuration

**backend/alembic.ini**

```ini
[alembic]
script_location = app/migrations
sqlalchemy.url = postgresql://postgres:!A9ff5a3c5@localhost:5433/CORE_OPC

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

#### 2. Initialize Alembic

```bash
cd backend

# Initialize alembic
alembic init app/migrations

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Run migration
alembic upgrade head
```

### Phase 5: Environment Configuration

#### 1. Create Environment Files

**backend/.env**

```env
# Database
DATABASE_URL=postgresql://postgres:!A9ff5a3c5@localhost:5433/CORE_OPC
DB_HOST=localhost
DB_PORT=5433
DB_NAME=CORE_OPC
DB_USER=postgres
DB_PASSWORD=!A9ff5a3c5

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Environment
ENVIRONMENT=development
DEBUG=true
```

**frontend/.env**

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=CORE OPC Alpha 1
VITE_APP_VERSION=1.0.0
```

**frontend/.env.production**

```env
VITE_API_BASE_URL=https://api.core-opc.com
VITE_APP_NAME=CORE OPC Alpha 1
VITE_APP_VERSION=1.0.0
```

### Phase 6: Development Scripts

#### 1. Create Package.json Scripts

**backend/package.json**

```json
{
  "name": "core-opc-backend",
  "version": "1.0.0",
  "description": "CORE OPC Alpha 1 Backend API",
  "scripts": {
    "dev": "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000",
    "start": "uvicorn app.main:app --host 0.0.0.0 --port 8000",
    "test": "pytest",
    "test:watch": "pytest --watch",
    "migrate": "alembic upgrade head",
    "migrate:create": "alembic revision --autogenerate -m",
    "migrate:rollback": "alembic downgrade -1",
    "db:reset": "alembic downgrade base && alembic upgrade head",
    "lint": "flake8 app/",
    "format": "black app/"
  },
  "devDependencies": {
    "black": "^23.11.0",
    "flake8": "^6.1.0"
  }
}
```

**frontend/package.json** (update scripts section)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:run && npm run test:e2e"
  }
}
```

#### 5. Frontend Testing Configuration

**frontend/vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "**/dist/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    reporters: ["verbose", "html"],
    outputFile: {
      html: "./reports/frontend-test-report.html",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Phase 7: Docker Setup

#### 1. Create Docker Configuration

**docker-compose.yml**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: CORE_OPC
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: !A9ff5a3c5
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - core-opc-network

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:!A9ff5a3c5@postgres:5432/CORE_OPC
    depends_on:
      - postgres
    networks:
      - core-opc-network
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - core-opc-network

volumes:
  postgres_data:

networks:
  core-opc-network:
    driver: bridge
```

**backend/Dockerfile**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**frontend/Dockerfile**

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Phase 8: Comprehensive Testing Framework

#### 1. Create Advanced Test Configuration

**backend/pytest.ini**

```ini
[tool:pytest]
testpaths = app/tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --tb=short
    --cov=app
    --cov-report=html:htmlcov
    --cov-report=term-missing
    --cov-report=xml:coverage.xml
    --html=reports/test_report.html
    --self-contained-html
    --junitxml=reports/junit.xml
    --strict-markers
    --disable-warnings
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
    auth: Authentication tests
    api: API endpoint tests
    database: Database tests
    tyson_tariff: Tyson tariff tests
    packing: Packing algorithm tests
    shipping: Shipping calculation tests
    slow: Slow running tests
    smoke: Smoke tests
```

**backend/app/tests/conftest.py**

```python
import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db.database import Base, get_db
from app.main import app
from app.models.user import User
from app.models.product import Product
from app.models.customer import Customer
from app.models.overpack_box import OverPackBox
from app.models.shipping_rate import ShippingRate
from app.models.shipping_calculation import ShippingCalculation
from app.models.tyson_tariff import TysonTariffZone, TysonTariffRate
from app.auth.jwt import create_access_token
from factory import Factory, Faker, SubFactory
from faker import Faker as FakerClass
import tempfile
import os

# Test database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Test fixtures
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def client():
    """Create test client with fresh database."""
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """Create database session for testing."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user(db_session):
    """Create test user."""
    user = User(
        id="test-user-1",
        email="test@example.com",
        password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.s.2a",  # "password"
        name="Test User",
        role="USER",
        customer_id="tyson"
    )
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def test_customer(db_session):
    """Create test customer."""
    customer = Customer(
        id="tyson",
        name="Tyson Foods",
        display_name="Tyson Foods Inc.",
        active=True
    )
    db_session.add(customer)
    db_session.commit()
    return customer

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers."""
    token = create_access_token({"sub": test_user.id})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def temp_file():
    """Create temporary file for testing."""
    with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp:
        yield tmp.name
    os.unlink(tmp.name)

# Factory definitions for test data generation
class CustomerFactory(Factory):
    class Meta:
        model = Customer

    id = Faker('uuid4')
    name = Faker('company')
    display_name = Faker('company')
    active = True

class UserFactory(Factory):
    class Meta:
        model = User

    id = Faker('uuid4')
    email = Faker('email')
    password = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.s.2a"  # "password"
    name = Faker('name')
    role = Faker('random_element', elements=['USER', 'ADMIN'])
    customer_id = SubFactory(CustomerFactory)

class ProductFactory(Factory):
    class Meta:
        model = Product

    name = Faker('word')
    sku = Faker('bothify', text='SKU-####')
    length = Faker('pyfloat', min_value=1.0, max_value=50.0)
    width = Faker('pyfloat', min_value=1.0, max_value=50.0)
    height = Faker('pyfloat', min_value=1.0, max_value=50.0)
    weight = Faker('pyfloat', min_value=0.1, max_value=100.0)
    active = True
    customer_id = "tyson"
    requires_dry_ice = Faker('boolean')
    hold = False
    on_hand_primary = Faker('pyint', min_value=0, max_value=1000)

class OverPackBoxFactory(Factory):
    class Meta:
        model = OverPackBox

    name = Faker('word')
    length = Faker('pyfloat', min_value=10.0, max_value=100.0)
    width = Faker('pyfloat', min_value=10.0, max_value=100.0)
    height = Faker('pyfloat', min_value=10.0, max_value=100.0)
    max_weight = Faker('pyfloat', min_value=50.0, max_value=1000.0)
    cost = Faker('pyfloat', min_value=1.0, max_value=50.0)
    active = True
    customer_id = "tyson"

class TysonTariffZoneFactory(Factory):
    class Meta:
        model = TysonTariffZone

    zone_code = Faker('bothify', text='Z#')
    zone_name = Faker('word')
    origin_zip_start = Faker('postcode')
    origin_zip_end = Faker('postcode')
    destination_zip_start = Faker('postcode')
    destination_zip_end = Faker('postcode')
    active = True

class TysonTariffRateFactory(Factory):
    class Meta:
        model = TysonTariffRate

    zone_id = Faker('pyint', min_value=1, max_value=10)
    service_level = Faker('random_element', elements=['Ground', 'TwoDay', 'Overnight'])
    weight_band_min = Faker('pyfloat', min_value=0.0, max_value=10.0)
    weight_band_max = Faker('pyfloat', min_value=10.0, max_value=100.0)
    base_rate = Faker('pyfloat', min_value=5.0, max_value=100.0)
    fuel_surcharge = Faker('pyfloat', min_value=0.0, max_value=10.0)
    special_handling_fee = Faker('pyfloat', min_value=0.0, max_value=20.0)
    dry_ice_fee = Faker('pyfloat', min_value=0.0, max_value=15.0)
    active = True
```

#### 2. Feature-Specific Test Examples

**backend/app/tests/test_auth.py**

```python
import pytest
from fastapi.testclient import TestClient
from app.auth.jwt import create_access_token, verify_token, get_password_hash, verify_password
from app.models.user import User

@pytest.mark.auth
@pytest.mark.unit
class TestAuthentication:
    """Test authentication functionality."""

    def test_password_hashing(self):
        """Test password hashing and verification."""
        password = "test_password_123"
        hashed = get_password_hash(password)

        assert hashed != password
        assert verify_password(password, hashed)
        assert not verify_password("wrong_password", hashed)

    def test_token_creation_and_verification(self):
        """Test JWT token creation and verification."""
        data = {"sub": "test_user_id", "role": "USER"}
        token = create_access_token(data)

        assert token is not None
        assert isinstance(token, str)

        payload = verify_token(token)
        assert payload is not None
        assert payload["sub"] == "test_user_id"
        assert payload["role"] == "USER"

    def test_invalid_token_verification(self):
        """Test invalid token verification."""
        invalid_token = "invalid.token.here"
        payload = verify_token(invalid_token)
        assert payload is None

@pytest.mark.auth
@pytest.mark.api
class TestAuthEndpoints:
    """Test authentication API endpoints."""

    def test_login_success(self, client, test_user):
        """Test successful login."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": test_user.email, "password": "password"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "nonexistent@example.com", "password": "wrong"}
        )

        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]

    def test_protected_endpoint_without_token(self, client):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/users/me")
        assert response.status_code == 401

    def test_protected_endpoint_with_token(self, client, auth_headers):
        """Test accessing protected endpoint with valid token."""
        response = client.get("/api/v1/users/me", headers=auth_headers)
        assert response.status_code == 200
```

**backend/app/tests/test_tyson_tariff.py**

```python
import pytest
from app.services.tyson_tariff_service import TysonTariffService
from app.schemas.tyson_tariff import TysonTariffCalculationRequest
from app.models.tyson_tariff import TysonTariffZone, TysonTariffRate
from app.tests.conftest import TysonTariffZoneFactory, TysonTariffRateFactory

@pytest.mark.tyson_tariff
@pytest.mark.unit
class TestTysonTariffService:
    """Test Tyson tariff calculation service."""

    def test_zone_lookup_success(self, db_session):
        """Test successful zone lookup."""
        # Create test zone
        zone = TysonTariffZoneFactory()
        db_session.add(zone)
        db_session.commit()

        service = TysonTariffService(db_session)
        result = service.get_zone_by_zip_codes(
            zone.origin_zip_start,
            zone.destination_zip_start
        )

        assert result is not None
        assert result.zone_code == zone.zone_code

    def test_zone_lookup_not_found(self, db_session):
        """Test zone lookup when zone doesn't exist."""
        service = TysonTariffService(db_session)
        result = service.get_zone_by_zip_codes("99999", "88888")
        assert result is None

    def test_rate_calculation_success(self, db_session):
        """Test successful rate calculation."""
        # Create test zone and rate
        zone = TysonTariffZoneFactory()
        db_session.add(zone)
        db_session.commit()

        rate = TysonTariffRateFactory(zone_id=zone.id)
        db_session.add(rate)
        db_session.commit()

        service = TysonTariffService(db_session)
        request = TysonTariffCalculationRequest(
            origin_zip=zone.origin_zip_start,
            destination_zip=zone.destination_zip_start,
            weight=5.0,
            service_level=rate.service_level,
            customer_id="tyson",
            requires_dry_ice=False,
            special_handling=False
        )

        result = service.calculate_tyson_rate(request)

        assert result is not None
        assert result.zone_code == zone.zone_code
        assert result.total_rate > 0
        assert result.base_rate == rate.base_rate

    def test_rate_calculation_with_fees(self, db_session):
        """Test rate calculation with special fees."""
        zone = TysonTariffZoneFactory()
        db_session.add(zone)
        db_session.commit()

        rate = TysonTariffRateFactory(
            zone_id=zone.id,
            special_handling_fee=10.0,
            dry_ice_fee=5.0
        )
        db_session.add(rate)
        db_session.commit()

        service = TysonTariffService(db_session)
        request = TysonTariffCalculationRequest(
            origin_zip=zone.origin_zip_start,
            destination_zip=zone.destination_zip_start,
            weight=5.0,
            service_level=rate.service_level,
            customer_id="tyson",
            requires_dry_ice=True,
            special_handling=True
        )

        result = service.calculate_tyson_rate(request)

        assert result is not None
        assert result.special_handling_fee == 10.0
        assert result.dry_ice_fee == 5.0
        assert result.total_rate > result.base_rate

@pytest.mark.tyson_tariff
@pytest.mark.api
class TestTysonTariffEndpoints:
    """Test Tyson tariff API endpoints."""

    def test_calculate_rate_endpoint(self, client, auth_headers, db_session):
        """Test rate calculation endpoint."""
        # Setup test data
        zone = TysonTariffZoneFactory()
        db_session.add(zone)
        db_session.commit()

        rate = TysonTariffRateFactory(zone_id=zone.id)
        db_session.add(rate)
        db_session.commit()

        request_data = {
            "origin_zip": zone.origin_zip_start,
            "destination_zip": zone.destination_zip_start,
            "weight": 5.0,
            "service_level": rate.service_level,
            "customer_id": "tyson",
            "requires_dry_ice": False,
            "special_handling": False
        }

        response = client.post(
            "/api/v1/tariff/calculate",
            json=request_data,
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert "total_rate" in data
        assert "zone_code" in data
        assert data["total_rate"] > 0
```

**backend/app/tests/test_packing_algorithm.py**

```python
import pytest
from app.services.packing_service import PackingService
from app.schemas.packing import PackingRequest, Package3D, OverPackBoxExtended
from app.tests.conftest import ProductFactory, OverPackBoxFactory

@pytest.mark.packing
@pytest.mark.unit
class TestPackingAlgorithm:
    """Test packing algorithm functionality."""

    def test_single_package_fit(self, db_session):
        """Test packing single package that fits."""
        # Create test package and box
        package = ProductFactory()
        box = OverPackBoxFactory()

        # Ensure package fits in box
        box.length = package.length * 2
        box.width = package.width * 2
        box.height = package.height * 2

        db_session.add(package)
        db_session.add(box)
        db_session.commit()

        service = PackingService(db_session)
        request = PackingRequest(
            packages=[Package3D(
                id=package.id,
                name=package.name,
                dimensions={
                    "length": package.length,
                    "width": package.width,
                    "height": package.height
                },
                weight=package.weight
            )],
            overpack_boxes=[OverPackBoxExtended(
                id=box.id,
                name=box.name,
                internal_dimensions={
                    "length": box.length,
                    "width": box.width,
                    "height": box.height
                },
                max_weight=box.max_weight,
                cost=box.cost
            )],
            optimization_goal="minimizeCost"
        )

        result = service.calculate_packing(request)

        assert result is not None
        assert len(result.solutions) > 0
        assert result.solutions[0].packages[0].package.id == package.id

    def test_package_too_large(self, db_session):
        """Test packing package that's too large for any box."""
        package = ProductFactory()
        box = OverPackBoxFactory()

        # Make box smaller than package
        box.length = package.length * 0.5
        box.width = package.width * 0.5
        box.height = package.height * 0.5

        db_session.add(package)
        db_session.add(box)
        db_session.commit()

        service = PackingService(db_session)
        request = PackingRequest(
            packages=[Package3D(
                id=package.id,
                name=package.name,
                dimensions={
                    "length": package.length,
                    "width": package.width,
                    "height": package.height
                },
                weight=package.weight
            )],
            overpack_boxes=[OverPackBoxExtended(
                id=box.id,
                name=box.name,
                internal_dimensions={
                    "length": box.length,
                    "width": box.width,
                    "height": box.height
                },
                max_weight=box.max_weight,
                cost=box.cost
            )],
            optimization_goal="minimizeCost"
        )

        result = service.calculate_packing(request)

        assert result is not None
        assert len(result.solutions) == 0
        assert len(result.rejected_packages) == 1
        assert result.rejected_packages[0].package.id == package.id
```

#### 3. Test Reporting System

**backend/app/tests/test_reporter.py**

```python
import pytest
import json
import os
from datetime import datetime
from pathlib import Path

class TestReporter:
    """Generate detailed test reports for feature implementation."""

    def __init__(self):
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)

    def generate_feature_report(self, feature_name, test_results):
        """Generate comprehensive feature test report."""
        report = {
            "feature": feature_name,
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_tests": len(test_results),
                "passed": sum(1 for r in test_results if r["status"] == "passed"),
                "failed": sum(1 for r in test_results if r["status"] == "failed"),
                "skipped": sum(1 for r in test_results if r["status"] == "skipped"),
                "coverage_percentage": self._calculate_coverage(test_results)
            },
            "test_details": test_results,
            "recommendations": self._generate_recommendations(test_results)
        }

        # Save JSON report
        json_file = self.reports_dir / f"{feature_name}_report.json"
        with open(json_file, 'w') as f:
            json.dump(report, f, indent=2)

        # Generate HTML report
        html_file = self.reports_dir / f"{feature_name}_report.html"
        self._generate_html_report(report, html_file)

        return report

    def _calculate_coverage(self, test_results):
        """Calculate test coverage percentage."""
        if not test_results:
            return 0

        covered_lines = set()
        total_lines = set()

        for result in test_results:
            if "coverage" in result:
                covered_lines.update(result["coverage"].get("covered_lines", []))
                total_lines.update(result["coverage"].get("total_lines", []))

        if not total_lines:
            return 100

        return (len(covered_lines) / len(total_lines)) * 100

    def _generate_recommendations(self, test_results):
        """Generate recommendations based on test results."""
        recommendations = []

        failed_tests = [r for r in test_results if r["status"] == "failed"]
        if failed_tests:
            recommendations.append({
                "type": "critical",
                "message": f"{len(failed_tests)} tests failed. Review and fix failing tests before deployment.",
                "tests": [r["name"] for r in failed_tests]
            })

        slow_tests = [r for r in test_results if r.get("duration", 0) > 5.0]
        if slow_tests:
            recommendations.append({
                "type": "performance",
                "message": f"{len(slow_tests)} tests are running slowly. Consider optimization.",
                "tests": [r["name"] for r in slow_tests]
            })

        coverage = self._calculate_coverage(test_results)
        if coverage < 80:
            recommendations.append({
                "type": "coverage",
                "message": f"Test coverage is {coverage:.1f}%. Aim for at least 80% coverage.",
                "suggestion": "Add more test cases to cover edge cases and error scenarios."
            })

        return recommendations

    def _generate_html_report(self, report, output_file):
        """Generate HTML test report."""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{report['feature']} Test Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .header {{ background-color: #f0f0f0; padding: 20px; border-radius: 5px; }}
                .summary {{ display: flex; gap: 20px; margin: 20px 0; }}
                .metric {{ background-color: #e8f4fd; padding: 15px; border-radius: 5px; text-align: center; }}
                .passed {{ color: #28a745; }}
                .failed {{ color: #dc3545; }}
                .skipped {{ color: #ffc107; }}
                .test-details {{ margin: 20px 0; }}
                .test-item {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }}
                .recommendations {{ background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{report['feature']} Test Report</h1>
                <p>Generated: {report['timestamp']}</p>
            </div>

            <div class="summary">
                <div class="metric">
                    <h3>Total Tests</h3>
                    <p>{report['summary']['total_tests']}</p>
                </div>
                <div class="metric passed">
                    <h3>Passed</h3>
                    <p>{report['summary']['passed']}</p>
                </div>
                <div class="metric failed">
                    <h3>Failed</h3>
                    <p>{report['summary']['failed']}</p>
                </div>
                <div class="metric skipped">
                    <h3>Skipped</h3>
                    <p>{report['summary']['skipped']}</p>
                </div>
                <div class="metric">
                    <h3>Coverage</h3>
                    <p>{report['summary']['coverage_percentage']:.1f}%</p>
                </div>
            </div>

            <div class="test-details">
                <h2>Test Details</h2>
                {self._generate_test_details_html(report['test_details'])}
            </div>

            <div class="recommendations">
                <h2>Recommendations</h2>
                {self._generate_recommendations_html(report['recommendations'])}
            </div>
        </body>
        </html>
        """

        with open(output_file, 'w') as f:
            f.write(html_content)

    def _generate_test_details_html(self, test_details):
        """Generate HTML for test details."""
        html = ""
        for test in test_details:
            status_class = test['status']
            html += f"""
            <div class="test-item">
                <h4 class="{status_class}">{test['name']}</h4>
                <p><strong>Status:</strong> {test['status'].upper()}</p>
                <p><strong>Duration:</strong> {test.get('duration', 0):.2f}s</p>
                {f"<p><strong>Error:</strong> {test['error']}</p>" if test.get('error') else ""}
            </div>
            """
        return html

    def _generate_recommendations_html(self, recommendations):
        """Generate HTML for recommendations."""
        html = ""
        for rec in recommendations:
            html += f"""
            <div>
                <h4>{rec['type'].upper()}</h4>
                <p>{rec['message']}</p>
                {f"<p><strong>Suggestion:</strong> {rec['suggestion']}</p>" if rec.get('suggestion') else ""}
            </div>
            """
        return html

# Pytest plugin for automatic reporting
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Generate test report data for each test."""
    outcome = yield
    rep = outcome.get_result()

    if rep.when == "call":
        # Store test result data
        item.test_result = {
            "name": item.name,
            "status": "passed" if rep.outcome == "passed" else "failed",
            "duration": call.duration,
            "error": str(rep.longrepr) if rep.failed else None
        }
```

#### 4. Test Execution Scripts

**scripts/run_tests.py**

```python
#!/usr/bin/env python3
"""
Comprehensive test runner for CORE_OPC Alpha 1
Generates detailed reports for each feature implementation
"""

import subprocess
import sys
import json
import argparse
from pathlib import Path
from app.tests.test_reporter import TestReporter

def run_feature_tests(feature_name, markers=None):
    """Run tests for a specific feature."""
    cmd = ["python", "-m", "pytest", "-v", "--tb=short"]

    if markers:
        cmd.extend(["-m", markers])
    else:
        cmd.extend(["-m", feature_name])

    # Add reporting options
    cmd.extend([
        "--html=reports/feature_test_report.html",
        "--self-contained-html",
        "--cov=app",
        "--cov-report=html:htmlcov",
        "--cov-report=term-missing",
        "--junitxml=reports/junit.xml"
    ])

    print(f"Running tests for feature: {feature_name}")
    print(f"Command: {' '.join(cmd)}")

    result = subprocess.run(cmd, capture_output=True, text=True)

    return {
        "returncode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "feature": feature_name
    }

def run_all_tests():
    """Run all tests and generate comprehensive report."""
    features = [
        "auth",
        "tyson_tariff",
        "packing",
        "shipping",
        "api",
        "database"
    ]

    all_results = {}
    reporter = TestReporter()

    for feature in features:
        print(f"\n{'='*50}")
        print(f"Testing feature: {feature}")
        print('='*50)

        result = run_feature_tests(feature)
        all_results[feature] = result

        if result["returncode"] == 0:
            print(f"✅ {feature} tests passed")
        else:
            print(f"❌ {feature} tests failed")
            print(f"Error: {result['stderr']}")

    # Generate comprehensive report
    print(f"\n{'='*50}")
    print("Generating comprehensive test report...")
    print('='*50)

    comprehensive_report = {
        "timestamp": datetime.now().isoformat(),
        "features": all_results,
        "overall_status": "PASS" if all(r["returncode"] == 0 for r in all_results.values()) else "FAIL"
    }

    # Save comprehensive report
    with open("reports/comprehensive_test_report.json", "w") as f:
        json.dump(comprehensive_report, f, indent=2)

    print(f"Test report saved to: reports/comprehensive_test_report.json")
    print(f"HTML report available at: reports/feature_test_report.html")

    return comprehensive_report

def main():
    parser = argparse.ArgumentParser(description="Run CORE_OPC Alpha 1 tests")
    parser.add_argument("--feature", help="Run tests for specific feature")
    parser.add_argument("--all", action="store_true", help="Run all tests")
    parser.add_argument("--markers", help="Run tests with specific markers")

    args = parser.parse_args()

    if args.all:
        run_all_tests()
    elif args.feature:
        run_feature_tests(args.feature, args.markers)
    else:
        print("Please specify --feature or --all")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

**scripts/test_runner.sh**

```bash
#!/bin/bash

# CORE_OPC Alpha 1 Test Runner
# Provides easy commands for running different types of tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory
mkdir -p reports

echo -e "${BLUE}CORE OPC Alpha 1 Test Runner${NC}"
echo "=================================="

case "$1" in
    "auth")
        echo -e "${YELLOW}Running Authentication Tests...${NC}"
        python -m pytest app/tests/test_auth.py -v --html=reports/auth_test_report.html --self-contained-html
        ;;
    "tyson")
        echo -e "${YELLOW}Running Tyson Tariff Tests...${NC}"
        python -m pytest app/tests/test_tyson_tariff.py -v --html=reports/tyson_tariff_test_report.html --self-contained-html
        ;;
    "packing")
        echo -e "${YELLOW}Running Packing Algorithm Tests...${NC}"
        python -m pytest app/tests/test_packing_algorithm.py -v --html=reports/packing_test_report.html --self-contained-html
        ;;
    "shipping")
        echo -e "${YELLOW}Running Shipping Calculation Tests...${NC}"
        python -m pytest app/tests/test_shipping_calculations.py -v --html=reports/shipping_test_report.html --self-contained-html
        ;;
    "api")
        echo -e "${YELLOW}Running API Endpoint Tests...${NC}"
        python -m pytest app/tests/test_api/ -v --html=reports/api_test_report.html --self-contained-html
        ;;
    "unit")
        echo -e "${YELLOW}Running Unit Tests...${NC}"
        python -m pytest -m unit -v --html=reports/unit_test_report.html --self-contained-html
        ;;
    "integration")
        echo -e "${YELLOW}Running Integration Tests...${NC}"
        python -m pytest -m integration -v --html=reports/integration_test_report.html --self-contained-html
        ;;
    "coverage")
        echo -e "${YELLOW}Running Tests with Coverage Report...${NC}"
        python -m pytest --cov=app --cov-report=html:htmlcov --cov-report=term-missing -v
        ;;
    "all")
        echo -e "${YELLOW}Running All Tests...${NC}"
        python scripts/run_tests.py --all
        ;;
    "smoke")
        echo -e "${YELLOW}Running Smoke Tests...${NC}"
        python -m pytest -m smoke -v --html=reports/smoke_test_report.html --self-contained-html
        ;;
    *)
        echo "Usage: $0 {auth|tyson|packing|shipping|api|unit|integration|coverage|all|smoke}"
        echo ""
        echo "Available test commands:"
        echo "  auth        - Authentication and authorization tests"
        echo "  tyson       - Tyson tariff calculation tests"
        echo "  packing     - Packing algorithm tests"
        echo "  shipping    - Shipping calculation tests"
        echo "  api         - API endpoint tests"
        echo "  unit        - Unit tests only"
        echo "  integration - Integration tests only"
        echo "  coverage    - Tests with coverage report"
        echo "  all         - Run all tests with comprehensive reporting"
        echo "  smoke       - Quick smoke tests"
        exit 1
        ;;
esac

echo -e "${GREEN}Test execution completed!${NC}"
echo "Check the reports/ directory for detailed test reports."
```

#### 5. Comprehensive Test Execution and Reporting

**scripts/run_all_tests.py**

```python
#!/usr/bin/env python3
"""
Comprehensive test runner for CORE_OPC Alpha 1
Runs both backend and frontend tests with detailed reporting
"""

import subprocess
import sys
import json
import argparse
import os
from datetime import datetime
from pathlib import Path

class TestRunner:
    def __init__(self):
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)
        self.results = {}

    def run_backend_tests(self, feature=None):
        """Run backend tests."""
        print("🔧 Running Backend Tests...")

        cmd = ["python", "-m", "pytest", "-v", "--tb=short"]

        if feature:
            cmd.extend(["-m", feature])

        cmd.extend([
            "--html=reports/backend_test_report.html",
            "--self-contained-html",
            "--cov=app",
            "--cov-report=html:htmlcov",
            "--cov-report=term-missing",
            "--junitxml=reports/backend_junit.xml"
        ])

        result = subprocess.run(cmd, capture_output=True, text=True, cwd="backend")

        self.results["backend"] = {
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "feature": feature
        }

        return result.returncode == 0

    def run_frontend_tests(self, test_type="all"):
        """Run frontend tests."""
        print("🎨 Running Frontend Tests...")

        if test_type == "unit":
            cmd = ["npm", "run", "test:run"]
        elif test_type == "e2e":
            cmd = ["npm", "run", "test:e2e"]
        else:
            cmd = ["npm", "run", "test:all"]

        result = subprocess.run(cmd, capture_output=True, text=True, cwd="frontend")

        self.results["frontend"] = {
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "test_type": test_type
        }

        return result.returncode == 0

    def generate_comprehensive_report(self):
        """Generate comprehensive test report."""
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "backend_passed": self.results.get("backend", {}).get("returncode", 1) == 0,
                "frontend_passed": self.results.get("frontend", {}).get("returncode", 1) == 0,
                "overall_status": "PASS" if all(
                    r.get("returncode", 1) == 0 for r in self.results.values()
                ) else "FAIL"
            },
            "results": self.results,
            "recommendations": self._generate_recommendations()
        }

        # Save JSON report
        with open(self.reports_dir / "comprehensive_test_report.json", "w") as f:
            json.dump(report, f, indent=2)

        # Generate HTML report
        self._generate_html_report(report)

        return report

    def _generate_recommendations(self):
        """Generate recommendations based on test results."""
        recommendations = []

        if not self.results.get("backend", {}).get("returncode", 1) == 0:
            recommendations.append({
                "type": "critical",
                "message": "Backend tests failed. Review and fix failing tests before deployment.",
                "action": "Check backend test output and fix issues"
            })

        if not self.results.get("frontend", {}).get("returncode", 1) == 0:
            recommendations.append({
                "type": "critical",
                "message": "Frontend tests failed. Review and fix failing tests before deployment.",
                "action": "Check frontend test output and fix issues"
            })

        if all(r.get("returncode", 1) == 0 for r in self.results.values()):
            recommendations.append({
                "type": "success",
                "message": "All tests passed! Ready for deployment.",
                "action": "Proceed with deployment process"
            })

        return recommendations

    def _generate_html_report(self, report):
        """Generate HTML test report."""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>CORE OPC Alpha 1 - Comprehensive Test Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }}
                .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }}
                .summary {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }}
                .metric {{ background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }}
                .metric.success {{ border-left-color: #28a745; }}
                .metric.failure {{ border-left-color: #dc3545; }}
                .recommendations {{ background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }}
                .test-details {{ margin: 20px 0; }}
                .test-section {{ background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0; }}
                .status-pass {{ color: #28a745; font-weight: bold; }}
                .status-fail {{ color: #dc3545; font-weight: bold; }}
                .code {{ background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 CORE OPC Alpha 1 Test Report</h1>
                    <p>Comprehensive testing results for all features</p>
                    <p>Generated: {report['timestamp']}</p>
                </div>

                <div class="summary">
                    <div class="metric {'success' if report['summary']['backend_passed'] else 'failure'}">
                        <h3>Backend Tests</h3>
                        <p class="{'status-pass' if report['summary']['backend_passed'] else 'status-fail'}">
                            {'✅ PASSED' if report['summary']['backend_passed'] else '❌ FAILED'}
                        </p>
                    </div>
                    <div class="metric {'success' if report['summary']['frontend_passed'] else 'failure'}">
                        <h3>Frontend Tests</h3>
                        <p class="{'status-pass' if report['summary']['frontend_passed'] else 'status-fail'}">
                            {'✅ PASSED' if report['summary']['frontend_passed'] else '❌ FAILED'}
                        </p>
                    </div>
                    <div class="metric {'success' if report['summary']['overall_status'] == 'PASS' else 'failure'}">
                        <h3>Overall Status</h3>
                        <p class="{'status-pass' if report['summary']['overall_status'] == 'PASS' else 'status-fail'}">
                            {'✅ READY FOR DEPLOYMENT' if report['summary']['overall_status'] == 'PASS' else '❌ NOT READY'}
                        </p>
                    </div>
                </div>

                <div class="recommendations">
                    <h2>📋 Recommendations</h2>
                    {self._generate_recommendations_html(report['recommendations'])}
                </div>

                <div class="test-details">
                    <h2>🔍 Test Details</h2>
                    {self._generate_test_details_html(report['results'])}
                </div>
            </div>
        </body>
        </html>
        """

        with open(self.reports_dir / "comprehensive_test_report.html", "w") as f:
            f.write(html_content)

    def _generate_recommendations_html(self, recommendations):
        """Generate HTML for recommendations."""
        html = ""
        for rec in recommendations:
            html += f"""
            <div style="margin: 10px 0; padding: 15px; background: white; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: {'#28a745' if rec['type'] == 'success' else '#dc3545' if rec['type'] == 'critical' else '#ffc107'}">
                    {rec['type'].upper()}
                </h4>
                <p style="margin: 0 0 10px 0;">{rec['message']}</p>
                <p style="margin: 0; font-style: italic; color: #666;">Action: {rec['action']}</p>
            </div>
            """
        return html

    def _generate_test_details_html(self, results):
        """Generate HTML for test details."""
        html = ""
        for component, result in results.items():
            status_class = "status-pass" if result.get("returncode", 1) == 0 else "status-fail"
            html += f"""
            <div class="test-section">
                <h3>{component.title()} Tests</h3>
                <p class="{status_class}">
                    {'✅ PASSED' if result.get('returncode', 1) == 0 else '❌ FAILED'}
                </p>
                {f'<div class="code">{result.get("stderr", "No error output")}</div>' if result.get("stderr") else ""}
            </div>
            """
        return html

def main():
    parser = argparse.ArgumentParser(description="Run comprehensive tests for CORE_OPC Alpha 1")
    parser.add_argument("--backend", action="store_true", help="Run only backend tests")
    parser.add_argument("--frontend", action="store_true", help="Run only frontend tests")
    parser.add_argument("--feature", help="Run tests for specific backend feature")
    parser.add_argument("--frontend-type", choices=["unit", "e2e", "all"], default="all", help="Frontend test type")
    parser.add_argument("--all", action="store_true", help="Run all tests (default)")

    args = parser.parse_args()

    runner = TestRunner()

    if args.backend:
        success = runner.run_backend_tests(args.feature)
        print(f"Backend tests: {'✅ PASSED' if success else '❌ FAILED'}")
    elif args.frontend:
        success = runner.run_frontend_tests(args.frontend_type)
        print(f"Frontend tests: {'✅ PASSED' if success else '❌ FAILED'}")
    else:
        # Run all tests
        backend_success = runner.run_backend_tests(args.feature)
        frontend_success = runner.run_frontend_tests(args.frontend_type)

        print(f"\n{'='*60}")
        print("📊 TEST SUMMARY")
        print('='*60)
        print(f"Backend Tests:  {'✅ PASSED' if backend_success else '❌ FAILED'}")
        print(f"Frontend Tests: {'✅ PASSED' if frontend_success else '❌ FAILED'}")
        print(f"Overall Status: {'✅ READY FOR DEPLOYMENT' if backend_success and frontend_success else '❌ NOT READY'}")
        print('='*60)

    # Generate comprehensive report
    report = runner.generate_comprehensive_report()

    print(f"\n📋 Test report saved to: reports/comprehensive_test_report.html")
    print(f"📋 JSON report saved to: reports/comprehensive_test_report.json")

    return 0 if report["summary"]["overall_status"] == "PASS" else 1

if __name__ == "__main__":
    sys.exit(main())
```

**scripts/test_commands.md**

````markdown
# CORE_OPC Alpha 1 Testing Commands

## Quick Test Commands

### Backend Testing

```bash
# Run all backend tests
cd backend && python -m pytest

# Run specific feature tests
cd backend && python -m pytest -m tyson_tariff
cd backend && python -m pytest -m auth
cd backend && python -m pytest -m packing

# Run with coverage
cd backend && python -m pytest --cov=app --cov-report=html

# Run specific test file
cd backend && python -m pytest app/tests/test_tyson_tariff.py -v
```
````

### Frontend Testing

```bash
# Run unit tests
cd frontend && npm run test

# Run tests in watch mode
cd frontend && npm run test:watch

# Run with coverage
cd frontend && npm run test:coverage

# Run E2E tests
cd frontend && npm run test:e2e

# Open test UI
cd frontend && npm run test:ui
```

### Comprehensive Testing

```bash
# Run all tests with reporting
python scripts/run_all_tests.py --all

# Run only backend tests
python scripts/run_all_tests.py --backend

# Run only frontend tests
python scripts/run_all_tests.py --frontend

# Run specific backend feature
python scripts/run_all_tests.py --backend --feature tyson_tariff

# Run specific frontend test type
python scripts/run_all_tests.py --frontend --frontend-type unit
```

## Test Report Locations

- **Backend HTML Report**: `reports/backend_test_report.html`
- **Frontend HTML Report**: `reports/frontend_test_report.html`
- **Comprehensive Report**: `reports/comprehensive_test_report.html`
- **Coverage Reports**: `htmlcov/index.html` (backend), `frontend/coverage/index.html` (frontend)
- **JSON Reports**: `reports/*.json`

## Test Categories

### Backend Test Markers

- `@pytest.mark.auth` - Authentication tests
- `@pytest.mark.tyson_tariff` - Tyson tariff tests
- `@pytest.mark.packing` - Packing algorithm tests
- `@pytest.mark.shipping` - Shipping calculation tests
- `@pytest.mark.api` - API endpoint tests
- `@pytest.mark.unit` - Unit tests
- `@pytest.mark.integration` - Integration tests

### Frontend Test Types

- **Unit Tests**: Component and hook testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install Backend Dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm install
      - name: Run Backend Tests
        run: |
          cd backend
          python -m pytest --cov=app --cov-report=xml
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm run test:run
      - name: Run E2E Tests
        run: |
          cd frontend
          npx playwright install
          npm run test:e2e
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml,./frontend/coverage/lcov.info
```

## Test Data Management

### Backend Test Data

- Uses Factory Boy for generating test data
- In-memory SQLite database for fast tests
- Mock external services with responses library

### Frontend Test Data

- Uses MSW (Mock Service Worker) for API mocking
- Faker.js for generating test data
- Playwright for E2E test data setup

## Performance Testing

### Backend Performance

```bash
# Run performance tests
cd backend && python -m pytest -m slow --durations=10

# Memory profiling
cd backend && python -m pytest --profile
```

### Frontend Performance

```bash
# Run performance tests
cd frontend && npm run test:coverage -- --reporter=verbose

# Bundle size analysis
cd frontend && npm run build && npx vite-bundle-analyzer dist
```

## Debugging Tests

### Backend Debugging

```bash
# Run with debug output
cd backend && python -m pytest -v -s --tb=long

# Run specific test with debugger
cd backend && python -m pytest app/tests/test_tyson_tariff.py::TestTysonTariffService::test_rate_calculation_success -v -s
```

### Frontend Debugging

```bash
# Run tests with debug output
cd frontend && npm run test -- --reporter=verbose

# Run specific test file
cd frontend && npm run test src/test/components/TysonTariffCalculator.test.tsx
```

## Test Maintenance

### Adding New Tests

1. Create test file in appropriate directory
2. Add appropriate markers (`@pytest.mark.feature_name`)
3. Write comprehensive test cases
4. Update test documentation
5. Run tests to ensure they pass

### Updating Test Data

1. Update factory definitions in `conftest.py`
2. Update mock handlers in frontend
3. Update test examples in documentation
4. Verify all tests still pass

### Test Coverage Goals

- **Backend**: 90%+ code coverage
- **Frontend**: 80%+ code coverage
- **E2E**: 100% critical user paths
- **API**: 100% endpoint coverage

````

### Phase 9: Deployment Scripts

#### 1. Create Deployment Scripts

**scripts/deploy.sh**

```bash
#!/bin/bash

echo "Deploying CORE OPC Alpha 1..."

# Build and deploy backend
echo "Building backend..."
cd backend
docker build -t core-opc-backend .
cd ..

# Build and deploy frontend
echo "Building frontend..."
cd frontend
npm run build
docker build -t core-opc-frontend .
cd ..

# Deploy with docker-compose
echo "Starting services..."
docker-compose up -d

echo "Deployment complete!"
````

**scripts/backup.sh**

```bash
#!/bin/bash

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="./backups/$DATE"

mkdir -p $BACKUP_DIR

echo "Creating backup at $BACKUP_DIR..."

# Backup database
pg_dump -h localhost -p 5433 -U postgres -d CORE_OPC > $BACKUP_DIR/database.sql

# Backup configuration files
cp -r config $BACKUP_DIR/

echo "Backup complete!"
```

### Phase 10: Development Workflow

#### 1. Create Development Guidelines

**docs/development.md**

````markdown
# Development Guidelines

## Getting Started

1. Clone the repository
2. Set up the development environment
3. Install dependencies
4. Configure environment variables
5. Start the development servers

## Development Commands

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

```bash
cd backend
alembic upgrade head
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Code Style

- Use Black for Python formatting
- Use Prettier for TypeScript/JavaScript formatting
- Follow PEP 8 for Python
- Follow ESLint rules for TypeScript/JavaScript

## Git Workflow

1. Create feature branch from main
2. Make changes and commit
3. Run tests
4. Create pull request
5. Code review
6. Merge to main

```

### Next Steps After Setup

1. **Database Migration**: Export existing data and import to new database
2. **API Development**: Implement all API endpoints
3. **Frontend Development**: Build React components and pages
4. **Integration**: Connect frontend and backend
5. **Testing**: Comprehensive testing suite
6. **Deployment**: Production deployment setup

This setup provides a complete foundation for the CORE_OPC Alpha 1 project with all necessary configurations, dependencies, and development tools.
```
