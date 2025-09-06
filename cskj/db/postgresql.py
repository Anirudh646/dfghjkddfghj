"""
PostgreSQL database connection manager using SQLAlchemy with async support
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

# SQLAlchemy Base for ORM models
Base = declarative_base()

# Naming convention for constraints (helpful for Alembic migrations)
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

Base.metadata = MetaData(naming_convention=convention)

# Global engine and session maker
engine = None
async_session_maker = None


async def init_postgres():
    """
    Initialize PostgreSQL connection pool
    """
    global engine, async_session_maker
    
    try:
        # Create async engine with connection pool
        engine = create_async_engine(
            settings.POSTGRES_URL,
            echo=settings.DEBUG,  # Log SQL queries in debug mode
            pool_size=20,
            max_overflow=0,
            pool_pre_ping=True,  # Validate connections before use
        )
        
        # Create session maker
        async_session_maker = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False
        )
        
        logger.info("PostgreSQL connection initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize PostgreSQL connection: {e}")
        raise


async def get_postgres_session() -> AsyncSession:
    """
    Dependency function to get PostgreSQL session
    Use this in FastAPI route dependencies
    """
    if not async_session_maker:
        raise RuntimeError("PostgreSQL not initialized. Call init_postgres() first.")
    
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_postgres():
    """
    Close PostgreSQL connection pool
    """
    global engine
    if engine:
        await engine.dispose()
        logger.info("PostgreSQL connection closed")
