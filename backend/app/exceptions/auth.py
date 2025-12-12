from fastapi import HTTPException

class AuthError(HTTPException):
    """Base exception for auth-related errors"""
    pass

class AuthenticationError(AuthError):
    def __init__(self, message: str = "Could not validate user"):
        super().__init__(status_code=401, detail=message)


class RegistrationError(AuthError):
    def __init__(self, message: str = "Unable to create user"):
        super().__init__(status_code=400, detail=message)