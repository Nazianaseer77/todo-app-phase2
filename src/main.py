from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from .api.routes.tasks import router as tasks_router
from .api.routes.auth import router as auth_router

# Import exception handlers
from .exceptions.handler import add_exception_handlers

# Import logging
from .logging_config import logger

app = FastAPI(
    title="Todo API Backend",
    description="Secure, production-ready FastAPI backend for the Todo application",
    version="1.0.0"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
add_exception_handlers(app)

# Include routers
app.include_router(tasks_router, prefix="/api/{user_id}", tags=["tasks"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Todo API Backend is running"}

@app.get("/health")
def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "healthy"}