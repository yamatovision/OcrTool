from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class UserRank(str, Enum):
    ADMIN = "管理者"
    KAIDEN = "皆伝"
    OKUDEN = "奥伝"
    CHUDEN = "中伝"
    SHODEN = "初伝"
    TRIAL = "お試し"
    WITHDRAWN = "退会者"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    userRank: UserRank = UserRank.TRIAL
    profileImageUrl: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    password: str
    resetCode: Optional[Dict[str, Any]] = None
    registrationDate: datetime = Field(default_factory=datetime.utcnow)
    lastLoginDate: Optional[datetime] = None
    totalConversations: int = 0
    dailyConversationLimit: int = 10
    availableFactories: List[str] = []
    lastPermissionChange: datetime = Field(default_factory=datetime.utcnow)
    postgresSync: Dict[str, Any] = Field(
        default_factory=lambda: {
            "status": "PENDING",
            "lastSyncAttempt": None,
            "syncError": None,
            "postgresId": None
        }
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserPublic(UserBase):
    id: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    userId: str
    email: EmailStr
    name: str
    userRank: UserRank

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    userRank: UserRank
    profileImageUrl: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    token: Optional[str] = None
    user: Optional[UserResponse] = None

class UserSettings(BaseModel):
    meta: Optional[Dict[str, Any]] = None
    # 他の設定項目も必要に応じて追加

class CurrentUser(BaseModel):
    userId: str
    email: str
    name: str
    userRank: UserRank
    profileImageUrl: Optional[str] = None
    settings: Optional[UserSettings] = None