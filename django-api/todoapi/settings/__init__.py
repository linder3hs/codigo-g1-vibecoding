"""Settings package for todoapi project.

This package contains modular settings for different environments.
By default, it loads development settings.

To use different settings, set the DJANGO_SETTINGS_MODULE environment variable:
- Development: todoapi.settings.development
- Production: todoapi.settings.production
"""

# Import development settings by default
from .development import *