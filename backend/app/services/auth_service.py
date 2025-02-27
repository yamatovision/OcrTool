from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from typing import Optional, Dict, Any
from ..db.connection import DatabaseService
from ..core.config import get_settings
from ..schemas.user import UserInDB, TokenData, UserCreate, UserRank
from ..models.user import UserModel

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

class AuthService:
    def __init__(self):
        self.db_service = DatabaseService.getInstance()
        self.user_model = UserModel
    
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        user = await self.user_model.get_user_by_email(email)
        
        if not user:
            return {
                "success": False,
                "message": "ユーザーが見つかりません"
            }
        
        if user.get("userRank") == UserRank.WITHDRAWN:
            return {
                "success": False,
                "message": "このアカウントは退会済みです"
            }
        
        if not await self.user_model.verify_password(password, user["password"]):
            return {
                "success": False,
                "message": "パスワードが一致しません"
            }
        
        # 最終ログイン日時を更新
        await self.user_model.update_login_date(str(user["_id"]))
        
        token = self.create_access_token(
            data={
                "userId": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "userRank": user["userRank"]
            }
        )
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "userRank": user["userRank"],
                "profileImageUrl": user.get("profileImageUrl")
            }
        }
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        user = await self.user_model.get_user_by_id(user_id)
        
        if not user:
            return None
        
        return {
            "_id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "userRank": user["userRank"],
            "profileImageUrl": user.get("profileImageUrl"),
            "settings": user.get("settings")
        }
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
    
    async def verify_token(self, token: str) -> Optional[TokenData]:
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            user_id: str = payload.get("userId")
            email: str = payload.get("email")
            name: str = payload.get("name")
            user_rank: str = payload.get("userRank")
            
            if user_id is None or email is None:
                return None
            
            return TokenData(
                userId=user_id,
                email=email,
                name=name,
                userRank=user_rank
            )
        except JWTError:
            return None
    
    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証情報が無効です",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        token_data = await self.verify_token(token)
        if token_data is None:
            raise credentials_exception
        
        user = await self.get_user_by_id(token_data.userId)
        if user is None:
            raise credentials_exception
        
        if user["userRank"] == UserRank.WITHDRAWN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="このアカウントは退会済みです"
            )
        
        return user