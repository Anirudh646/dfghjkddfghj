"""
MongoDB connection manager using Motor (async MongoDB driver)
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Global MongoDB client and database
mongo_client: AsyncIOMotorClient = None
mongo_db: AsyncIOMotorDatabase = None


async def init_mongodb():
    """
    Initialize MongoDB connection
    """
    global mongo_client, mongo_db
    
    try:
        # Create async MongoDB client
        mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
        
        # Get database
        mongo_db = mongo_client[settings.MONGODB_DB]
        
        # Test connection
        await mongo_client.admin.command('ping')
        
        logger.info("MongoDB connection initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize MongoDB connection: {e}")
        raise


def get_mongodb() -> AsyncIOMotorDatabase:
    """
    Get MongoDB database instance
    Use this in service functions to access MongoDB
    """
    if not mongo_db:
        raise RuntimeError("MongoDB not initialized. Call init_mongodb() first.")
    
    return mongo_db


async def close_mongodb():
    """
    Close MongoDB connection
    """
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection closed")


# Collection helpers
class MongoCollections:
    """
    MongoDB collection names as constants
    """
    ESSAYS = "essays"
    DOCUMENTS = "documents"
    ESSAY_REVIEWS = "essay_reviews"
    UPLOAD_METADATA = "upload_metadata"


def get_collection(collection_name: str):
    """
    Get a specific MongoDB collection
    """
    db = get_mongodb()
    return db[collection_name]
