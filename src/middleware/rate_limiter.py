import time
from collections import defaultdict, deque
from fastapi import HTTPException, status
from typing import Dict
from threading import Lock


class RateLimiter:
    def __init__(self, max_requests: int = 100, window_seconds: int = 3600):
        """
        Initialize the rate limiter.

        Args:
            max_requests: Maximum number of requests allowed in the window
            window_seconds: Time window in seconds
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, deque] = defaultdict(deque)
        self.lock = Lock()

    def is_allowed(self, identifier: str) -> bool:
        """
        Check if a request from the given identifier is allowed.

        Args:
            identifier: Unique identifier for the client (IP, user ID, etc.)

        Returns:
            True if request is allowed, False otherwise
        """
        with self.lock:
            now = time.time()
            # Remove requests that are outside the time window
            while (self.requests[identifier] and
                   now - self.requests[identifier][0] > self.window_seconds):
                self.requests[identifier].popleft()

            # Check if we've exceeded the limit
            if len(self.requests[identifier]) >= self.max_requests:
                return False

            # Add the current request
            self.requests[identifier].append(now)
            return True


# Global rate limiter instance
rate_limiter = RateLimiter(max_requests=100, window_seconds=3600)  # 100 requests per hour


def check_rate_limit(identifier: str):
    """
    Check if the request is within the rate limit.

    Args:
        identifier: Unique identifier for the client

    Raises:
        HTTPException: If rate limit is exceeded
    """
    if not rate_limiter.is_allowed(identifier):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )