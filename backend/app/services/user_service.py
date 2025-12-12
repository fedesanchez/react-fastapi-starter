import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.user import UserResponse, PasswordChange
from app.db.schema import User
from app.exceptions.user import UserNotFoundError, InvalidPasswordError, PasswordMismatchError
from app.services.auth_service import AuthService


class UserService:
    def __init__(self, session: AsyncSession):
        self._db = session

    async def get_user_by_id(self, user_id: int) -> UserResponse:
        result = await self._db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            logging.warning(f"User not found with ID: {user_id}")
            raise UserNotFoundError(user_id)
        logging.info(f"Successfully retrieved user with ID: {user_id}")
        return user


    async def change_password(self, user_id: int, password_change: PasswordChange) -> None:
        try:
            user = await self.get_user_by_id(user_id)
            
            if not AuthService.verify_password(password_change.current_password, user.password_hash):
                logging.warning(f"Invalid current password provided for user ID: {user_id}")
                raise InvalidPasswordError()
            
            if password_change.new_password != password_change.new_password_confirm:
                logging.warning(f"Password mismatch during change attempt for user ID: {user_id}")
                raise PasswordMismatchError()
            
            user.password_hash = AuthService.get_password_hash(password_change.new_password)
            await self._db.commit()
            logging.info(f"Successfully changed password for user ID: {user_id}")
        
        except Exception as e:
            logging.error(f"Error during password change for user ID: {user_id}. Error: {str(e)}")
            raise
