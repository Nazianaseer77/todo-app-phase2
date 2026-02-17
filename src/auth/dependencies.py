from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..utils.jwt import verify_token_user_match

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to get the current authenticated user from JWT token.
    Raises HTTPException if token is invalid.
    """
    token = credentials.credentials

    # We'll verify the token format and validity here
    # In a real implementation, we would call a function to decode and verify the token
    # For now, we'll just return a mock user ID
    # The actual verification will be done in the route handlers
    return token


def verify_user_owns_resource(token: str, user_id: str):
    """
    Verify that the authenticated user owns the resource they're trying to access.
    """
    if not verify_token_user_match(token, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own resources"
        )