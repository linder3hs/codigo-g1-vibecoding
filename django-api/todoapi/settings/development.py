"""Development settings for todoapi project.

This module contains settings specific to the development environment.
It inherits from base.py and overrides/adds development-specific configurations.
"""

from .base import *
from decouple import config
import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

# Allowed hosts configuration for development
ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS', 
    default='localhost,127.0.0.1', 
    cast=lambda v: [s.strip() for s in v.split(',')]
)


# Database configuration for development
# Default SQLite configuration for development
default_database_url = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"

# Use DATABASE_URL from environment or default to SQLite
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default=default_database_url)
    )
}


# CORS Configuration for Development
# WARNING: These settings are permissive and should NOT be used in production
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins for development
CORS_ALLOW_CREDENTIALS = True  # Allow credentials in CORS requests

# Allowed headers for CORS requests
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allowed HTTP methods for CORS requests
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Headers to expose in CORS responses
CORS_EXPOSE_HEADERS = [
    'content-type',
    'x-csrftoken',
]

# CORS preflight cache time (24 hours)
CORS_PREFLIGHT_MAX_AGE = 86400


# Development-specific logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'todoapi': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}


# Email backend for development (console)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# Cache configuration for development (dummy cache)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}


# Development-specific DRF settings
REST_FRAMEWORK.update({
    # Enable browsable API for development
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
})
