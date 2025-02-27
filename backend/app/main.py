from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .api.auth import router as auth_router
from .core.config import get_settings
from .db.connection import DatabaseService
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
db = DatabaseService.getInstance()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS設定を更新
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.on_event("startup")
async def startup_db_client():
    await db.connect()
    logger.info("Database connected")

@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close()
    logger.info("Database disconnected")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["認証"])
