from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "GIS DB"
    DEBUG: bool = False
    ENVIRONMENT: str = 'development'
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = ""
    DB_PASS: str = ""
    DB_NAME: str = "test"
    ACCESS_TOKEN_SECRET: str = "mi_super_secreto_de_acceso"
    REFRESH_TOKEN_SECRET: str = "mi_super_secreto_de_refresco_largo"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_MINUTES:int = 7 * 24 * 60 # 7 días
    REFRESH_TOKEN_COOKIE_NAME: str = "app_refresh_token"

    @property
    def DB_URL(self):
        #return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        return f"sqlite+aiosqlite:///./{self.DB_NAME}.db"

settings = Settings()

