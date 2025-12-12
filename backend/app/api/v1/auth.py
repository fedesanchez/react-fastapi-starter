from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

from app.models.auth import Token, RegisterUserRequest
from app.services.auth_service import AuthService
from app.db.core import get_db
from app.core.rate_limiter import limiter
from app.core.settings import settings

router = APIRouter(
    prefix='/api/v1/auth',
    tags=['auth']
)

async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(session=db)


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
async def register_user(request: Request, register_user_request: RegisterUserRequest, service: AuthService = Depends(get_auth_service)):
    await service.register_user(register_user_request)


@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response, service: AuthService = Depends(get_auth_service)):
    auth_tokens = await service.login_for_access_token(form_data)
    service.set_refresh_cookie(response, auth_tokens.refresh_token)
    return Token(access_token=auth_tokens.access_token, token_type=auth_tokens.token_type)    


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, service: AuthService = Depends(get_auth_service)):
    service.clear_refresh_cookie(response)
 

@router.post("/refresh-token", response_model=Token)
async def refresh_access_token(request: Request, response: Response, service: AuthService = Depends(get_auth_service)):    
    auth_tokens = await service.refresh_access_token(request)
    service.set_refresh_cookie(response, auth_tokens.refresh_token)
    return Token(access_token=auth_tokens.access_token, token_type=auth_tokens.token_type)



