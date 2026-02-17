import jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("AUTH_SECRET")
if not SECRET_KEY:
    # Raise an error if AUTH_SECRET is not set
    raise ValueError("AUTH_SECRET environment variable is not set. Please set it in your .env file.")

ALGORITHM = "HS256"


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify JWT token, returning the payload if valid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("userId") or payload.get("sub")

        if user_id is None:
            return None

        # Check if token is expired
        exp = payload.get("exp")
        if exp and datetime.utcnow().timestamp() > exp:
            return None

        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None


def verify_token_user_match(token: str, user_id: str) -> bool:
    """
    Verify that the user_id in the token matches the expected user_id.
    """
    payload = decode_access_token(token)
    if not payload:
        return False

    token_user_id = payload.get("userId") or payload.get("sub")
    return token_user_id == user_id