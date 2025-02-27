from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "OCR Text Extractor"
    API_V1_STR: str = "/api/v1"
    GOOGLE_CLOUD_PROJECT: str = "yamatovision-blue-lamp"
    GOOGLE_APPLICATION_CREDENTIALS: str = "./credentials/vision-api-key.json"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    MAX_FILES: int = 100
    ALLOWED_EXTENSIONS: set = {"png", "jpg", "jpeg"}
    
    # MongoDB設定
    MONGODB_URL: str = "mongodb+srv://lisence:FhpQAu5UPwjm0L1J@motherprompt-cluster.np3xp.mongodb.net/motherprompt?retryWrites=true&w=majority&appName=MotherPrompt-Cluster"
    MONGODB_DB_NAME: str = "motherprompt"
    
    # JWT認証設定
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 14 * 24 * 60  # 14日間

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

@lru_cache()
def get_settings():
    return Settings()
