from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.settings import settings

ASYNC_DATABASE_URL= settings.DB_URL 
async_engine = create_async_engine(ASYNC_DATABASE_URL)
async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    """Dependency to get async database session"""
    async with async_session() as session:
        yield session


