import pytest
import pytest_asyncio
#import aiosqlite    
import warnings
from datetime import datetime, timezone
#from sqlalchemy.orm import sessionmaker
#from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.db.core import Base
from app.db.schema import User 
from app.models.auth import TokenData
from app.services.auth_service import AuthService
from app.core.rate_limiter import limiter
from .test_db import engine, TestingSessionLocal


@pytest_asyncio.fixture(scope="function")
async def db():
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestingSessionLocal() as db:
        yield db 

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture(scope="function")
def test_user():
    # Create a user with a known password hash
    password_hash = AuthService.get_password_hash("password123")
    return User(
        email="test@example.com",
        first_name="Test",
        last_name="User",
        password_hash=password_hash
    )

@pytest.fixture(scope="function")
def test_token_data():
    return TokenData(user_id=1)


@pytest_asyncio.fixture(scope="function")
async def client():
    from app.main import app
    from app.db.core import get_async_db
    
    # Disable rate limiting for tests
    limiter.reset()
    
    async def override_get_db():
        try:
            yield db
        finally:
            await db.close()
            
    app.dependency_overrides[get_async_db] = override_get_db
    
    from fastapi.testclient import TestClient
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def auth_headers(client):
    # Register a test user
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test.user@example.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User"
        }
    )
    assert response.status_code == 201
    
    # Login to get access token
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test.user@example.com",
            "password": "testpassword123",
            "grant_type": "password"
        }
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    return {"Authorization": f"Bearer {token}"} 
