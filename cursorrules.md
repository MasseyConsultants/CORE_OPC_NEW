# CORE OPC Alpha 1 - Cursor Rules & Development Guardrails

## Project Overview

This is a full-stack shipping calculator application for AIT World Wide Logistics where Tyson Food is our customer we will begin wiht the first implimentation with React 18.3.1 frontend and Python/FastAPI backend. The application handles shipping calculations, tariff calculations, and packing optimization.

## Technology Stack & Version Constraints

### Backend (Python/FastAPI)

- **Python**: 3.11+ (compatible with psycopg2-binary)
- **FastAPI**: 0.110.0
- **SQLAlchemy**: 2.0.36
- **PostgreSQL**: 15 (port 5433)
- **Pydantic**: 2.9.2 (use `model_config` not `class Config`)
- **Alembic**: 1.13.2 for migrations
- **JWT**: python-jose[cryptography]==3.3.0
- **Password Hashing**: passlib[bcrypt]==1.7.4 (use bcrypt==4.0.1 for compatibility)

### Frontend (React/Vite)

- **React**: 18.3.1 (NOT 19.x - compatibility issues with Three.js)
- **Vite**: 5.4.10
- **TypeScript**: 5.6.3
- **Three.js**: 0.145.0 (compatible with React 18.3.1)
- **@react-three/fiber**: 8.8.7
- **@react-three/drei**: 9.32.4
- **Tailwind CSS**: 3.4.17
- **React Router**: 6.28.1

### Testing

- **Backend**: pytest==8.3.4, pytest-asyncio==0.24.0
- **Frontend**: vitest==1.6.0, @testing-library/react==14.2.1
- **E2E**: playwright==1.40.1

## Database Schema Conventions

### Column Naming

- Use **camelCase** for database columns to match existing schema
- Examples: `customerId`, `createdAt`, `updatedAt`, `onHandPrimary`
- **NOT** snake_case (`customer_id`, `created_at`)

### Table Structure

- Primary keys: `id` (String for users, Integer for products)
- Foreign keys: `customerId` (references customers.id)
- Timestamps: `createdAt`, `updatedAt` (DateTime with timezone)
- Boolean fields: `active`, `requiresDryIce`, `hold`

## Code Style & Conventions

### Python/Backend

```python
# Use Pydantic V2 syntax
class Settings(BaseSettings):
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False
    }

# Use SQLAlchemy 2.0 syntax
from sqlalchemy.orm import declarative_base
Base = declarative_base()

# Use proper type hints
from typing import List, Optional
ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
```

### TypeScript/Frontend

```typescript
// Use React 18.3.1 patterns
import React, { useState, useEffect } from "react";

// Use proper TypeScript interfaces
interface User {
  id: string;
  email: string;
  customerId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Use camelCase for API responses
const user: User = {
  id: "123",
  email: "user@example.com",
  customerId: "tyson",
  createdAt: "2024-01-01T00:00:00Z",
};
```

## API Design Patterns

### Endpoint Structure

- Base URL: `/api/v1`
- Authentication: `/api/v1/auth/*`
- Resources: `/api/v1/users`, `/api/v1/products`
- Use proper HTTP methods: GET, POST, PUT, DELETE
- Return consistent response formats

### Authentication

- JWT tokens with 30-minute expiration
- Use `Bearer` token in Authorization header
- Store token in localStorage
- Implement proper token refresh logic

### Error Handling

- Use proper HTTP status codes
- Return consistent error response format
- Log errors appropriately
- Handle 401/403 gracefully in frontend

## UI/UX Guidelines

### Layout Requirements

- **Full-width application**: Must fill entire browser window (100vw, 100vh)
- **No scrollbars**: Use `overflow-hidden` on main containers
- **Enterprise appearance**: Professional, clean, modern design
- **Responsive**: Mobile-first approach with desktop enhancements

### Component Structure

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

### Styling Guidelines

- Use Tailwind CSS classes
- Apply `w-full h-full` to main containers
- Use `enterprise-table` class for data tables
- Implement proper loading states
- Use consistent color scheme (blue primary, red for Tyson branding)

## File Structure & Organization

### Backend Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── auth/            # Authentication logic
│   ├── core/            # Configuration
│   ├── db/              # Database setup
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   └── tests/           # Test files
├── alembic/             # Database migrations
└── requirements.txt
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components
│   │   ├── calculator/  # Calculator components
│   │   └── ...
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── test/            # Test files
├── public/
└── package.json
```

## Environment Configuration

### Backend Environment (.env)

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

### Frontend Environment (.env)

```env
VITE_API_BASE_URL=http://localhost:8001
VITE_APP_NAME=CORE OPC Alpha 1
VITE_APP_VERSION=1.0.0
```

## Testing Requirements

### Backend Testing

- Use pytest with proper markers
- Test all API endpoints
- Test authentication flows
- Test database operations
- Use factory-boy for test data generation
- Maintain 80%+ code coverage

### Frontend Testing

- Use Vitest for unit tests
- Use Testing Library for component tests
- Use Playwright for E2E tests
- Test user interactions
- Test API integration
- Mock external dependencies

## Security Guidelines

### Authentication

- Hash passwords with bcrypt
- Use JWT for session management
- Implement proper token expiration
- Validate all inputs
- Use HTTPS in production

### Data Protection

- Sanitize user inputs
- Use parameterized queries
- Implement proper CORS
- Validate file uploads
- Log security events

## Performance Guidelines

### Backend Performance

- Use database indexes appropriately
- Implement pagination for large datasets
- Use connection pooling
- Cache frequently accessed data
- Optimize database queries

### Frontend Performance

- Use React.memo for expensive components
- Implement proper loading states
- Use lazy loading for routes
- Optimize bundle size
- Use proper image optimization

## Development Workflow

### Git Workflow

1. Create feature branch from main
2. Make changes following conventions
3. Write/update tests
4. Run test suite
5. Create pull request
6. Code review
7. Merge to main

### Code Review Checklist

- [ ] Follows naming conventions
- [ ] Proper error handling
- [ ] Tests written/updated
- [ ] Documentation updated
- [ ] Security considerations
- [ ] Performance impact assessed

## Common Pitfalls to Avoid

### Backend

- Don't use snake_case for database columns
- Don't use `class Config` in Pydantic (use `model_config`)
- Don't forget to handle database connection errors
- Don't expose sensitive data in logs
- Don't skip input validation

### Frontend

- Don't use React 19.x (compatibility issues)
- Don't forget to handle loading states
- Don't use snake_case for API responses
- Don't forget to clean up useEffect dependencies
- Don't skip error boundaries

### Database

- Don't use snake_case column names
- Don't forget foreign key constraints
- Don't skip database migrations
- Don't hardcode database credentials
- Don't forget to backup data

## Deployment Guidelines

### Environment Setup

- Use Docker for containerization
- Use environment variables for configuration
- Implement proper logging
- Use reverse proxy (nginx)
- Implement health checks

### Production Considerations

- Use production database
- Implement proper monitoring
- Use CDN for static assets
- Implement proper backup strategy
- Use SSL certificates

## Feature Development Priorities

### Phase 1: Core Features

1. User authentication and management
2. Product catalog management
3. Basic shipping calculator
4. Database integration

### Phase 2: Advanced Features

1. Tyson tariff calculations
2. Packing optimization algorithm
3. Advanced UI components
4. Comprehensive testing

### Phase 3: Production Features

1. Performance optimization
2. Security hardening
3. Monitoring and logging
4. Deployment automation

## Troubleshooting Common Issues

### Backend Issues

- **psycopg2-binary compilation**: Use `pip install psycopg2-binary --only-binary=all`
- **Pydantic V2 errors**: Use `model_config` instead of `class Config`
- **SQLAlchemy 2.0 warnings**: Update imports to use `sqlalchemy.orm.declarative_base`
- **bcrypt compatibility**: Use `bcrypt==4.0.1`

### Frontend Issues

- **React version conflicts**: Stick to React 18.3.1
- **Three.js compatibility**: Use compatible versions (0.145.0)
- **TypeScript errors**: Use proper type definitions
- **Build errors**: Check Vite configuration

### Database Issues

- **Column name mismatches**: Use camelCase consistently
- **Foreign key errors**: Ensure referenced tables exist
- **Migration issues**: Check Alembic configuration
- **Connection errors**: Verify database credentials

## Code Quality Standards

### Python Code Quality

- Follow PEP 8 style guide
- Use type hints consistently
- Write docstrings for functions/classes
- Use meaningful variable names
- Keep functions small and focused

### TypeScript Code Quality

- Use strict TypeScript configuration
- Write proper interfaces
- Use meaningful variable names
- Keep components focused
- Use proper error handling

### Code Documentation

- Document all public APIs
- Write clear README files
- Document configuration options
- Write setup instructions
- Document deployment process

### API Documentation

ed we have products in the database we need to use whats in the database its actual

- Use FastAPI automatic documentation
- Document all endpoints
- Provide example requests/responses
- Document error codes
- Keep documentation up to date

Remember: This is a professional enterprise application. Code quality, security, and maintainability are paramount. Always test thoroughly and follow established patterns.
