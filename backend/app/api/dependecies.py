from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from collections.abc import Generator
from typing import Annotated
from sqlmodel import Session
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.core import security
from app.core.config import settings
from app.core.database import engine
from app.models import User, TokenPayload, AccountType

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/login")


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # if not user.is_active:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_admin_user(current_user: CurrentUser) -> User:
    if not current_user.account_type == AccountType.ADMIN:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


CurrentAdmin = Annotated[User, Depends(get_current_admin_user)]
