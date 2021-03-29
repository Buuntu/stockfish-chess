from pydantic import BaseModel
from enum import Enum
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = None
    last_name: str = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


class MessageTypeEnum(str, Enum):
    USER_CONNECTED = "USER_CONNECTED"
    NEW_GAME = "NEW_GAME"
    USER_DISCONNECTED = "USER_DISCONNECTED"
    MESSAGE_SENT = "MESSAGE_SENT"
    USER_TYPING = "USER_TYPING"
    USER_STOPPED_TYPING = "USER_STOPPED_TYPING"
    ERROR = "ERROR"


class WebSocketResponse(BaseModel):
    type: MessageTypeEnum
    data: t.Dict
