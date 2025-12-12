import pytest
from datetime import timedelta
from unittest.mock import Mock
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
import asyncio

from app.services.auth_service import AuthService
from app.models.auth import RegisterUserRequest, AuthTokens, Token
from app.core.exceptions import AuthenticationError
from app.db.schema import User
from app.core.settings import settings


class TestAuthService:
    @pytest.mark.asyncio
    async def test_verify_password(self, db):
        auth_service = AuthService(session=db)
        password = "password123"
        hashed = auth_service.get_password_hash(password)
        assert auth_service.verify_password(password, hashed)
        assert not auth_service.verify_password("wrongpassword", hashed)
    
    @pytest.mark.asyncio
    async def test_authenticate_user(self, db, test_user):
        auth_service = AuthService(session=db)
        db.add(test_user)
        await db.commit()
        
        user = await auth_service.authenticate_user("test@example.com", "password123")
        assert user is not False
        assert user.email == test_user.email
    
    @pytest.mark.asyncio
    async def test_login_for_access_token(self, db, test_user):
        auth_service = AuthService(session=db)
        db.add(test_user)
        await db.commit()

        class FormData:
            def __init__(self):
                self.username = "test@example.com"
                self.password = "password123"
                self.scope = ""
                self.client_id = None
                self.client_secret = None
        
        form_data = FormData()
        auth_tokens = await auth_service.login_for_access_token(form_data)
        assert auth_tokens.token_type == "bearer"
        assert auth_tokens.access_token is not None

@pytest.mark.asyncio
async def test_register_user(db):
    auth_service = AuthService(session=db)
    request = RegisterUserRequest(
        email="new@example.com",
        password="password123",
        first_name="New",
        last_name="User"
    )
    await auth_service.register_user(request)
    
    result = await db.execute(select(User).where(User.email == "new@example.com"))
    user = result.scalar_one_or_none()
    assert user is not None
    assert user.email == "new@example.com"
    assert user.first_name == "New"
    assert user.last_name == "User"

@pytest.mark.asyncio
async def test_create_and_verify_token(db):
    auth_service = AuthService(session=db)

    user_id = 1
    token = auth_service.create_access_token("test@example.com", user_id, timedelta(minutes=30))
    
    token_data = auth_service.verify_token(token)
    assert token_data.get_id() == user_id

    # Test invalid credentials
    assert await auth_service.authenticate_user("test@example.com", "wrongpassword") is False

    with pytest.raises(AuthenticationError):
        form_data = OAuth2PasswordRequestForm(
            username="test@example.com",
            password="wrongpassword",
            scope=""
        )
        await auth_service.login_for_access_token(form_data) 

@pytest.mark.asyncio
async def test_refresh_access_token_success(db, test_user):
    """
    Prueba la rotación de tokens con un Refresh Token válido.
    """
    auth_service = AuthService(session=db)

    db.add(test_user)
    await db.commit()
    await db.refresh(test_user) # Asegurar que el ID esté cargado

    valid_refresh_token = auth_service.create_refresh_token(
        test_user.email, 
        test_user.id, 
        timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    )

    await asyncio.sleep(1) # Asegurar que el token no sea exactamente igual al generado 

    mock_request = Mock()
    mock_request.cookies = {settings.REFRESH_TOKEN_COOKIE_NAME: valid_refresh_token}

    auth_tokens: AuthTokens = await auth_service.refresh_access_token(
        request=mock_request
    )

    assert isinstance(auth_tokens, AuthTokens)
    assert auth_tokens.access_token is not None
    assert auth_tokens.refresh_token is not None
    assert auth_tokens.token_type == "bearer"
    assert auth_tokens.refresh_token != valid_refresh_token


@pytest.mark.asyncio
@pytest.mark.parametrize("missing_cookie_name", [None, "wrong_token_name" ])
async def test_refresh_access_token_missing_token(db, missing_cookie_name):
    auth_service = AuthService(session=db)
    mock_request = Mock()
    mock_request.cookies = {}
    if missing_cookie_name:
            mock_request.cookies = {missing_cookie_name: "some_value"}

    with pytest.raises(AuthenticationError) as excinfo:
        await auth_service.refresh_access_token(request=mock_request)
    
    assert "Refresh token missing" in str(excinfo.value)


@pytest.mark.asyncio
async def test_refresh_access_token_invalid_token(db):
    """
    Prueba el fallo si el Refresh Token es inválido (ej. expirado, mal firmado).
    """
    auth_service = AuthService(session=db)
    invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwMDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    
    mock_request = Mock()
    mock_request.cookies = {settings.REFRESH_TOKEN_COOKIE_NAME: invalid_token}

    with pytest.raises(AuthenticationError) as excinfo:
        await auth_service.refresh_access_token(request=mock_request)
    
    assert "Invalid refresh token or expired" in str(excinfo.value)
