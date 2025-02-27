from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..schemas.user import AuthResponse, UserResponse, LoginRequest
from ..services.auth_service import AuthService
from ..middleware.auth import AuthMiddleware
from ..core.config import get_settings

settings = get_settings()
router = APIRouter()
auth_service = AuthService()

@router.post("/login", response_model=AuthResponse)
async def login(login_data: LoginRequest):
    if not login_data.email or not login_data.password:
        return AuthResponse(
            success=False,
            message="メールアドレスとパスワードを入力してください"
        )
    
    result = await auth_service.authenticate_user(login_data.email, login_data.password)
    
    if not result:
        return AuthResponse(
            success=False,
            message="ユーザーが見つかりません"
        )
    
    return AuthResponse(**result)

@router.get("/me", response_model=AuthResponse)
async def get_current_user(user = Depends(AuthMiddleware())):
    if not user:
        return AuthResponse(
            success=False,
            message="認証が必要です"
        )
    
    return AuthResponse(
        success=True,
        user=UserResponse(
            id=user["userId"],
            email=user["email"],
            name=user["name"],
            userRank=user["userRank"]
        )
    )