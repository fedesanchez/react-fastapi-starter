import asyncio
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.db.core import async_engine, Base
from app.core.logging import configure_logging, LogLevels
from app.core.settings import settings

configure_logging(LogLevels.info)
from app.db.schema import User  # Import models to register them

# Routes
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router

app = FastAPI(title=settings.APP_NAME)

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)


    
