import pytest

from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.models.user import PasswordChange
from app.core.exceptions import UserNotFoundError, InvalidPasswordError, PasswordMismatchError
from app.db.schema import User
from sqlalchemy import select

@pytest.mark.asyncio
async def test_get_user_by_id(db, test_user):
    user_service = UserService(session=db)
    db.add(test_user)
    await db.commit()
    
    user = await user_service.get_user_by_id(test_user.id)
    assert user.id == test_user.id
    assert user.email == test_user.email
    
    with pytest.raises(UserNotFoundError):
        await user_service.get_user_by_id(99999)

@pytest.mark.asyncio
async def test_change_password(db, test_user):
    # Add the user to the database
    user_service = UserService(session=db)
    auth_service = AuthService(session=db)
    db.add(test_user)
    await db.commit()
    
    # Test successful password change
    password_change = PasswordChange(
        current_password="password123",  # This matches the password set in test_user fixture
        new_password="newpassword123",
        new_password_confirm="newpassword123"
    )
    
    await user_service.change_password(test_user.id, password_change)
    
    # Verify new password works
    result = await db.execute(select(User).where(User.id == test_user.id))
    updated_user = result.scalar_one_or_none()
    assert auth_service.verify_password("newpassword123", updated_user.password_hash)

@pytest.mark.asyncio
async def test_change_password_invalid_current(db, test_user):
    user_service = UserService(session=db)
    db.add(test_user)
    await db.commit()

    # Test invalid current password
    with pytest.raises(InvalidPasswordError):
        password_change = PasswordChange(
            current_password="wrongpassword",
            new_password="newpassword123",
            new_password_confirm="newpassword123"
        )
        await user_service.change_password(test_user.id, password_change)

@pytest.mark.asyncio
async def test_change_password_mismatch(db, test_user):
    user_service = UserService(session=db)
    db.add(test_user)
    await db.commit()

    # Test password mismatch
    with pytest.raises(PasswordMismatchError):
        password_change = PasswordChange(
            current_password="password123",
            new_password="newpassword123",
            new_password_confirm="differentpassword"
        )
        await user_service.change_password(test_user.id, password_change) 
