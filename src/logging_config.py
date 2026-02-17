import logging
import sys
from datetime import datetime
from typing import Optional


class ColoredFormatter(logging.Formatter):
    """Custom formatter to add colors to log levels."""

    # Define color codes
    COLORS = {
        'DEBUG': '\x1b[36m',      # Cyan
        'INFO': '\x1b[32m',       # Green
        'WARNING': '\x1b[33m',    # Yellow
        'ERROR': '\x1b[31m',      # Red
        'CRITICAL': '\x1b[35m',   # Magenta
        'RESET': '\x1b[0m',       # Reset
        'BLUE': '\x1b[34m',       # Blue
    }

    def __init__(self, fmt, log_colors=None):
        super().__init__()
        self.fmt = fmt
        # If no log_colors provided, use default color mapping
        if log_colors is None:
            log_colors = {
                logging.DEBUG: self.COLORS['DEBUG'],
                logging.INFO: self.COLORS['INFO'],
                logging.WARNING: self.COLORS['WARNING'],
                logging.ERROR: self.COLORS['ERROR'],
                logging.CRITICAL: self.COLORS['CRITICAL'],
            }
        self.log_colors = log_colors
        self.reset = self.COLORS['RESET']

    def format(self, record):
        # Apply color based on log level
        level_color = self.log_colors.get(record.levelno, '')
        reset_color = self.reset

        # Format the message with colors
        formatted_message = self.fmt.replace('%(log_color)s', level_color)
        formatted_message = formatted_message.replace('%(reset)s', reset_color)
        formatted_message = formatted_message.replace('%(blue)s', self.COLORS['BLUE'])

        # Create a temporary formatter with the colored format
        temp_formatter = logging.Formatter(formatted_message)
        return temp_formatter.format(record)


def setup_logging():
    """Set up logging configuration for the application."""
    # Create logger
    logger = logging.getLogger("todo_api")
    logger.setLevel(logging.INFO)

    # Prevent duplicate handlers if already configured
    if logger.handlers:
        return logger

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Create file handler
    file_handler = logging.FileHandler("todo_api.log")
    file_handler.setLevel(logging.INFO)

    # Create formatters and add them to handlers
    detailed_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
    )
    colored_formatter = ColoredFormatter(
        fmt="%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(message)s"
    )

    console_handler.setFormatter(colored_formatter)
    file_handler.setFormatter(detailed_formatter)

    # Add handlers to the logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger


# Global logger instance
logger = setup_logging()


def log_request(user_id: str, endpoint: str, method: str, status_code: int):
    """Log API request details."""
    logger.info(f"REQUEST - User: {user_id}, Method: {method}, Endpoint: {endpoint}, Status: {status_code}")


def log_error(user_id: str, endpoint: str, error: str):
    """Log API error details."""
    logger.error(f"ERROR - User: {user_id}, Endpoint: {endpoint}, Message: {error}")