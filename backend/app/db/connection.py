import pymongo
from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import get_settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseService, cls).__new__(cls)
            cls._instance.client = None
            cls._instance.db = None
        return cls._instance
    
    @classmethod
    def getInstance(cls):
        if cls._instance is None:
            cls._instance = DatabaseService()
        return cls._instance
    
    async def connect(self):
        if self.client is None:
            try:
                settings = get_settings()
                self.client = AsyncIOMotorClient(settings.MONGODB_URL)
                self.db = self.client[settings.MONGODB_DB_NAME]
                logger.info("Connected to MongoDB")
            except Exception as e:
                logger.error(f"Failed to connect to MongoDB: {e}")
                raise e
        return self.db
    
    async def close(self):
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            logger.info("Closed MongoDB connection")
    
    async def get_collection(self, collection_name: str):
        if self.db is None:
            await self.connect()
        return self.db[collection_name]