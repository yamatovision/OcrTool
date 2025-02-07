from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "OCR Text Extractor"
    API_V1_STR: str = "/api/v1"
    GOOGLE_CLOUD_PROJECT: str
    GOOGLE_APPLICATION_CREDENTIALS: str
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    MAX_FILES: int = 100
    ALLOWED_EXTENSIONS: set = {"png", "jpg", "jpeg"}

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
