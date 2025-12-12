import logging
from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pwdlib import PasswordHash
import jwt
from jwt import PyJWTError
from jwt.exceptions import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.auth import TokenData, RegisterUserRequest, Token, AuthTokens
from app.exceptions.auth import AuthenticationError, RegistrationError
from app.core.settings import settings
from app.db.schema import User

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='api/v1/auth/login')
password_hash = PasswordHash.recommended()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return password_hash.hash(password)


def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]) -> TokenData:
    return verify_token(token)


def verify_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, settings.ACCESS_TOKEN_SECRET, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get('id')
        return TokenData(user_id=int(user_id))
    except PyJWTError as e:
        logging.warning(f"Token verification failed: {str(e)}")
        raise AuthenticationError()


class AuthService:
    def __init__(self, session: AsyncSession):
        self._db = session

   
    async def authenticate_user(self, email: str, password: str) -> User | bool:
        result = await self._db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(password, user.password_hash):
            logging.warning(f"Failed authentication attempt for email: {email}")
            return False
        return user


    def create_access_token(self, email: str, user_id: int, expires_delta: timedelta) -> str:
        encode = {
            'sub': email,
            'id': str(user_id),
            'exp': datetime.now(timezone.utc) + expires_delta,
            'type': 'access'
        }
        return jwt.encode(encode, settings.ACCESS_TOKEN_SECRET, algorithm=settings.ALGORITHM)


    def create_refresh_token(self, email: str, user_id: int, expires_delta: timedelta) -> str:
        encode = {
            'sub': email,
            'id': str(user_id),
            'exp': datetime.now(timezone.utc) + expires_delta,
            'type': 'refresh'
        }
        return jwt.encode(encode, settings.REFRESH_TOKEN_SECRET, algorithm=settings.ALGORITHM)


    def set_refresh_cookie(self, response: Response, refresh_token: str) -> None:
        max_age_seconds = settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60 
        is_secure = (settings.ENVIRONMENT == 'production')
        samesite_str = "strict" if is_secure else "lax"
        response.set_cookie(
            key=settings.REFRESH_TOKEN_COOKIE_NAME,
            value=refresh_token,
            httponly=True,
            secure=is_secure,
            samesite=samesite_str,
            max_age=max_age_seconds,
        )


    def clear_refresh_cookie(self, response: Response) -> None:
        response.delete_cookie(key=settings.REFRESH_TOKEN_COOKIE_NAME)


    async def register_user(self, register_user_request: RegisterUserRequest) -> None:
        try:
            
            result = await self._db.execute(
                select(User).where(User.email == register_user_request.email)
            )
            existing_user = result.scalar_one_or_none()
            if existing_user:
                raise RegistrationError("User with this email already exists.")

            create_user_model = User(            
                email=register_user_request.email,
                first_name=register_user_request.first_name,
                last_name=register_user_request.last_name,
                password_hash=get_password_hash(register_user_request.password)
            )    
            self._db.add(create_user_model)
            await self._db.commit()
        except RegistrationError:
            raise
        except Exception as e:
            logging.error(f"Failed to register user: {register_user_request.email}. Error: {str(e)}")
            raise RegistrationError("Failed to create user.")


    async def login_for_access_token(self, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> AuthTokens:
        user = await self.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise AuthenticationError()
        access_token = self.create_access_token(user.email, user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        refresh_token = self.create_refresh_token(user.email, user.id, timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES))
        
        return AuthTokens(access_token=access_token, refresh_token=refresh_token)


    async def refresh_access_token(self, request: Request) -> AuthTokens:
        refresh_token = request.cookies.get(settings.REFRESH_TOKEN_COOKIE_NAME)
        if not refresh_token:
            raise AuthenticationError("Refresh token missing")

        try:
            payload = jwt.decode(refresh_token, settings.REFRESH_TOKEN_SECRET, algorithms=[settings.ALGORITHM])
            
            if payload.get("type") != "refresh":
                raise AuthenticationError("Invalid token type")
            
            user_id: str = payload.get('id')
            email: str = payload.get('sub')
            if not user_id or not email:
                raise AuthenticationError("Invalid token payload")

            result = await self._db.execute(select(User).where(User.email == email).where(User.id == int(user_id)))
            user = result.scalar_one_or_none()
            if not user:
                raise AuthenticationError("User not found")

        except (PyJWTError, InvalidTokenError):
            raise AuthenticationError("Invalid refresh token or expired")
        
        # Issue new tokens (refresh token rotation optional but recommended)
        access_token = self.create_access_token(user.email, int(user.id), timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        #refresh_token = self.create_refresh_token(user.email, int(user.id), timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES))

        return AuthTokens(access_token=access_token, refresh_token=refresh_token)    

CurrentUser = Annotated[TokenData, Depends(get_current_user)]
