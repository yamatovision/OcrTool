from datetime import datetime
from bson.objectid import ObjectId
from passlib.context import CryptContext
from ..db.connection import DatabaseService

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserModel:
    collection_name = "users"
    
    @classmethod
    async def get_user_by_email(cls, email: str):
        db_service = DatabaseService.getInstance()
        users_collection = await db_service.get_collection(cls.collection_name)
        return await users_collection.find_one({"email": email})
    
    @classmethod
    async def get_user_by_id(cls, user_id: str):
        db_service = DatabaseService.getInstance()
        users_collection = await db_service.get_collection(cls.collection_name)
        return await users_collection.find_one({"_id": ObjectId(user_id)})
    
    @classmethod
    async def create_user(cls, user_data: dict):
        db_service = DatabaseService.getInstance()
        users_collection = await db_service.get_collection(cls.collection_name)
        
        # パスワードのハッシュ化
        if "password" in user_data:
            user_data["password"] = pwd_context.hash(user_data["password"])
        
        # 基本フィールドの設定
        user_data["registrationDate"] = datetime.utcnow()
        user_data["lastPermissionChange"] = datetime.utcnow()
        user_data["totalConversations"] = 0
        user_data["dailyConversationLimit"] = 10
        user_data["availableFactories"] = []
        user_data["postgresSync"] = {
            "status": "PENDING",
            "lastSyncAttempt": None,
            "syncError": None,
            "postgresId": None
        }
        
        result = await users_collection.insert_one(user_data)
        return await cls.get_user_by_id(str(result.inserted_id))
    
    @classmethod
    async def update_user(cls, user_id: str, update_data: dict):
        db_service = DatabaseService.getInstance()
        users_collection = await db_service.get_collection(cls.collection_name)
        
        # パスワード更新の場合はハッシュ化
        if "password" in update_data:
            update_data["password"] = pwd_context.hash(update_data["password"])
        
        update_data["updated_at"] = datetime.utcnow()
        
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return await cls.get_user_by_id(user_id)
    
    @classmethod
    async def update_login_date(cls, user_id: str):
        db_service = DatabaseService.getInstance()
        users_collection = await db_service.get_collection(cls.collection_name)
        
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"lastLoginDate": datetime.utcnow()}}
        )
    
    @classmethod
    async def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    @classmethod
    async def is_admin(cls, user):
        return user.get("userRank") == "管理者"
    
    @classmethod
    async def is_deactivated(cls, user):
        return user.get("userRank") == "退会者"
    
    @classmethod
    async def is_reset_code_valid(cls, user, code: str):
        reset_code = user.get("resetCode")
        if not reset_code:
            return False
        
        return (
            reset_code.get("code") == code and
            reset_code.get("expiresAt") > datetime.utcnow()
        )
    
    @classmethod
    async def update_sync_status(cls, user_id: str, status: str, error=None, postgres_id=None):
        db_service = DatabaseService.getInstance()
        users_collection = await db_service.get_collection(cls.collection_name)
        
        update_data = {
            "postgresSync.status": status,
            "postgresSync.lastSyncAttempt": datetime.utcnow(),
        }
        
        if error is not None:
            update_data["postgresSync.syncError"] = error
        
        if postgres_id is not None:
            update_data["postgresSync.postgresId"] = postgres_id
        
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return await cls.get_user_by_id(user_id)