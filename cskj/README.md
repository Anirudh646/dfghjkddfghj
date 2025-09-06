# AI Admission Counsellor Platform - Backend

A comprehensive FastAPI-based backend system for an AI-powered college admission counselling platform.

## 🏗️ Architecture Overview

The platform is built with a microservices-oriented architecture using FastAPI as the central API gateway that orchestrates multiple specialized services:

### Services
1. **Student Profile Service** - Manages student information and academic profiles
2. **College Matching Engine** - AI-powered college recommendation and matching
3. **Essay Review Service** - LLM-powered essay analysis and feedback
4. **Notification/Reminder Service** - Multi-channel notification system

### Technology Stack
- **Framework**: FastAPI
- **Databases**: 
  - PostgreSQL (via SQLAlchemy + Alembic) for structured data
  - MongoDB (via Motor) for documents and essays
- **Authentication**: JWT-based authentication
- **LLM Integration**: OpenAI/Anthropic APIs for essay review
- **Caching**: Redis for performance optimization
- **Task Queue**: Celery for background tasks

## 📁 Project Structure

```
├── main.py                     # API Gateway and application entry point
├── config/                     # Configuration management
│   ├── __init__.py
│   └── settings.py            # Pydantic settings with env variables
├── db/                        # Database connection managers
│   ├── __init__.py
│   ├── postgresql.py          # PostgreSQL async connection
│   └── mongodb.py             # MongoDB async connection
├── utils/                     # Shared utilities
│   ├── __init__.py
│   ├── logging.py             # Centralized logging setup
│   ├── validation.py          # Common validation utilities
│   └── exceptions.py          # Custom exception classes
├── student_profile/           # Student Profile Service
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── student.py         # SQLAlchemy + Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   └── student_service.py # Business logic
│   └── routes/
│       ├── __init__.py
│       └── student_routes.py  # API endpoints
├── college_matching/          # College Matching Engine
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── college.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── matching_service.py
│   └── routes/
│       ├── __init__.py
│       └── matching_routes.py
├── essay_review/              # Essay Review Service (LLM-powered)
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── essay.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── essay_service.py
│   └── routes/
│       ├── __init__.py
│       └── essay_routes.py
├── notification/              # Notification/Reminder Service
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── notification.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── notification_service.py
│   └── routes/
│       ├── __init__.py
│       └── notification_routes.py
├── tests/                     # Comprehensive test suite
│   ├── __init__.py
│   ├── conftest.py            # Test configuration and fixtures
│   ├── test_student_profile.py
│   ├── test_college_matching.py
│   ├── test_essay_review.py
│   └── test_notification.py
├── alembic/                   # Database migrations
│   ├── env.py
│   └── script.py.mako
├── requirements.txt           # Python dependencies
├── alembic.ini               # Alembic configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL
- MongoDB
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-admission-counsellor-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

5. **Database setup**
   ```bash
   # Initialize Alembic
   alembic init alembic
   
   # Create first migration
   alembic revision --autogenerate -m "Initial migration"
   
   # Run migrations
   alembic upgrade head
   ```

6. **Run the application**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

## 🔗 API Endpoints

### Student Profile Service
- `POST /api/v1/students/` - Create student profile
- `GET /api/v1/students/{id}` - Get student profile
- `PUT /api/v1/students/{id}` - Update student profile
- `DELETE /api/v1/students/{id}` - Delete student profile
- `GET /api/v1/students/search/` - Search students

### College Matching Engine
- `POST /api/v1/matching/match` - Match colleges for student
- `GET /api/v1/matching/recommendations/{student_id}` - Get recommendations
- `GET /api/v1/matching/probability/{student_id}/{college_id}` - Admission probability

### Essay Review Service
- `POST /api/v1/essays/` - Create essay
- `GET /api/v1/essays/{id}` - Get essay
- `PUT /api/v1/essays/{id}` - Update essay
- `POST /api/v1/essays/review` - AI-powered essay review
- `GET /api/v1/essays/{id}/analytics` - Essay analytics

### Notification Service
- `POST /api/v1/notifications/` - Create notification
- `GET /api/v1/notifications/{id}` - Get notification
- `GET /api/v1/notifications/student/{student_id}` - Get student notifications
- `POST /api/v1/notifications/bulk` - Send bulk notifications

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_student_profile.py

# Run with verbose output
pytest -v
```

## 🗄️ Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🔧 Configuration

The application uses Pydantic Settings for configuration management. Key settings include:

- Database connections (PostgreSQL, MongoDB)
- External API keys (OpenAI, Anthropic)
- Email configuration
- Security settings
- Logging configuration

All settings can be configured via environment variables or a `.env` file.

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build image
docker build -t ai-admission-counsellor .

# Run with docker-compose
docker-compose up -d
```

### Manual Deployment

1. Set up production environment variables
2. Configure reverse proxy (Nginx)
3. Use production ASGI server (Gunicorn + Uvicorn)
4. Set up database backups
5. Configure monitoring and logging

## 🛠️ Development

### Code Quality
```bash
# Format code
black .
isort .

# Lint code
flake8 .
mypy .
```

### Pre-commit hooks
```bash
pip install pre-commit
pre-commit install
```

## 🔮 Future Enhancements

The current implementation provides a solid foundation with placeholder functions for:

- **Advanced College Matching**: Machine learning models for better recommendations
- **LLM Essay Review**: Integration with OpenAI/Anthropic for detailed feedback
- **Real-time Notifications**: WebSocket support for instant updates
- **Analytics Dashboard**: Student progress tracking and insights
- **Mobile API**: Optimized endpoints for mobile applications

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on the repository or contact the development team.
