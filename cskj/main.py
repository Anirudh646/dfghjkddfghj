"""
AI Admission Counsellor Platform - Main API Gateway
FastAPI application entry point that orchestrates all services
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config.settings import settings
from db.postgresql import init_postgres
from db.mongodb import init_mongodb
from utils.logging import setup_logging

# Import service routers
from student_profile.routes.student_routes import router as student_router
from college_matching.routes.matching_routes import router as matching_router
from essay_review.routes.essay_routes import router as essay_router
from notification.routes.notification_routes import router as notification_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events - startup and shutdown
    """
    # Startup
    setup_logging()
    await init_postgres()
    await init_mongodb()
    
    yield
    
    # Shutdown
    # Add cleanup logic here if needed
    pass


# Initialize FastAPI app with lifespan events
app = FastAPI(
    title="AI Admission Counsellor Platform",
    description="Backend API for AI-powered college admission guidance",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy", "message": "AI Admission Counsellor Platform is running"}

# Register service routers with prefixes
app.include_router(student_router, prefix="/api/v1/students", tags=["Student Profile"])
app.include_router(matching_router, prefix="/api/v1/matching", tags=["College Matching"])
app.include_router(essay_router, prefix="/api/v1/essays", tags=["Essay Review"])
app.include_router(notification_router, prefix="/api/v1/notifications", tags=["Notifications"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
