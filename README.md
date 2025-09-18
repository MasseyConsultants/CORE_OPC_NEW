# CORE OPC Calculator

## 🎯 Project Overview

**CORE OPC Calculator** (Core Overpack Calculator) is a web-based shipping calculator that uses 3D Bin Packing Problem (BPP) algorithms to optimally pack products into overpack boxes and calculate shipping rates for AIT World Wide Logistics customers.

**Primary Client:** AIT World Wide Logistics  
**First Customer Implementation:** Tyson Foods  
**Target Users:** AIT logistics team, Tyson Foods logistics team, and other future customers who need optimal shipping calculations.

## 🏗️ Technology Stack

### Backend
- **Python**: 3.11+
- **FastAPI**: 0.110.0
- **SQLAlchemy**: 2.0.36
- **PostgreSQL**: 15 (port 5433)
- **Pydantic**: 2.9.2
- **JWT**: python-jose[cryptography]==3.3.0

### Frontend
- **React**: 18.3.1
- **TypeScript**: 5.6.3
- **Vite**: 5.4.10
- **Tailwind CSS**: 3.4.17
- **Three.js**: 0.145.0
- **@react-three/fiber**: 8.8.7
- **@react-three/drei**: 9.32.4

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MasseyConsultants/CORE_OPC_NEW.git
   cd CORE_OPC_NEW
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Configure .env with your database credentials
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure .env with your API URL
   ```

### Development

1. **Start the backend**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8001
   ```

2. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 📁 Project Structure

```
CORE_OPC_Alpha_1/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── auth/            # Authentication logic
│   │   ├── core/            # Configuration
│   │   ├── db/              # Database setup
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── tests/           # Test files
│   ├── alembic/             # Database migrations
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   ├── contexts/        # React contexts
    │   └── types/           # TypeScript types
    └── package.json
```

## 🧮 Core Features

- **3D Bin Packing Algorithm**: Optimizes product packing using BFD, FFD, and BLF strategies
- **Real-time Calculation**: Instant shipping rate calculations
- **3D Visualization**: Interactive 3D packing visualization with Three.js
- **Admin Dashboard**: User and product management
- **Multi-customer Support**: Designed for AIT's multiple customers

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

### End-to-End Testing
```bash
npm run test:e2e
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `customers` - Customer information
- `products` - Product catalog with dimensions
- `overpack_boxes` - Available shipping boxes

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5433/CORE_OPC
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8001
VITE_APP_NAME=CORE OPC Alpha 1
```

## 🚀 Deployment

### Production Environment
- **Frontend**: Hostinger static hosting (coreopc.robertwmassey.com)
- **Backend**: VPS API server (api.robertwmassey.com:8002)
- **Database**: PostgreSQL on VPS

## 📝 Development Guidelines

- Follow the development plan in `dev_plan.md`
- Use test-driven development approach
- Commit frequently with descriptive messages
- Follow the coding standards in `cursorrules.md`
- Refer to the Product Requirements Document in `PDR.md`

## 🤝 Contributing

1. Follow the development workflow outlined in `dev_plan.md`
2. Write tests for all new features
3. Ensure all tests pass before committing
4. Follow the coding standards and conventions

## 📄 License

This project is proprietary software for AIT World Wide Logistics.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: In Development
