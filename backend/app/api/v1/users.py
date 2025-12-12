from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.core import get_db
from app.models.user import UserResponse, PasswordChange
from app.services.user_service import UserService
from app.services.auth_service import CurrentUser

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)

def get_user_service(db: AsyncSession = Depends(get_db))  -> UserService:
    return UserService(session=db)


@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: CurrentUser, service: UserService = Depends(get_user_service)):
    return await service.get_user_by_id(current_user.get_id())


@router.put("/change-password", status_code=status.HTTP_200_OK)
async def change_password(    
    current_user: CurrentUser,    
    password_change: PasswordChange,
    service: UserService = Depends(get_user_service)
):
    await service.change_password(current_user.get_id(), password_change)
