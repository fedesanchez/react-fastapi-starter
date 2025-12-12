from pydantic import BaseModel, EmailStr

class RegisterUserRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str

class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    user_id: int | None = None

    def get_id(self) -> int | None:
        if self.user_id:
            return self.user_id
        return None