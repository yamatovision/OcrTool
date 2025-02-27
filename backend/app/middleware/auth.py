from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from ..core.config import get_settings
from ..services.auth_service import AuthService
from ..schemas.user import UserRank

settings = get_settings()
security = HTTPBearer()
auth_service = AuthService()

async def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    token = credentials.credentials
    
    try:
        token_data = await auth_service.verify_token(token)
        if token_data is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効なトークンです"
            )
        
        user = await auth_service.get_user_by_id(token_data.userId)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ユーザーが見つかりません"
            )
        
        # 退会者の場合はアクセスを拒否
        if user["userRank"] == UserRank.WITHDRAWN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="このアカウントは退会済みです"
            )
        
        return {
            "userId": user["_id"],
            "email": user["email"],
            "name": user["name"],
            "userRank": user["userRank"],
            "profileImageUrl": user.get("profileImageUrl"),
            "settings": user.get("settings")
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="トークンの検証に失敗しました"
        )

class AuthMiddleware:
    def __init__(self, optional: bool = False, min_rank: UserRank = None):
        self.optional = optional
        self.min_rank = min_rank
    
    async def __call__(self, request: Request):
        if "Authorization" not in request.headers and self.optional:
            return None
        
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                if self.optional:
                    return None
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="認証が必要です"
                )
            
            scheme, token = auth_header.split()
            if scheme.lower() != 'bearer':
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="認証方式が無効です"
                )
            
            credentials = HTTPAuthorizationCredentials(scheme=scheme, credentials=token)
            user = await verify_token(credentials)
            
            # ユーザーランクのチェック（必要な場合）
            if self.min_rank is not None:
                rank_order = {
                    UserRank.ADMIN: 7,
                    UserRank.KAIDEN: 6,
                    UserRank.OKUDEN: 5,
                    UserRank.CHUDEN: 4,
                    UserRank.SHODEN: 3,
                    UserRank.TRIAL: 2,
                    UserRank.WITHDRAWN: 1
                }
                
                if rank_order.get(user["userRank"]) < rank_order.get(self.min_rank):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="このリソースにアクセスする権限がありません"
                    )
            
            return user
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効な認証ヘッダーです"
            )