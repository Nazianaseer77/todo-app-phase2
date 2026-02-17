from sqlmodel import Session
from ..config.db import engine


def get_session():
    """
    Generator function to provide database session dependency.
    """
    with Session(engine) as session:
        yield session