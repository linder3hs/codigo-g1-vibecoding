#!/usr/bin/env python
"""Environment management utility for todoapi project.

This script helps manage different Django settings environments.
It provides utilities to switch between development and production settings.
"""

import os
import sys
from pathlib import Path

# Available environments
ENVIRONMENTS = {
    'development': 'todoapi.settings.development',
    'production': 'todoapi.settings.production',
    'dev': 'todoapi.settings.development',  # Alias
    'prod': 'todoapi.settings.production',  # Alias
}


def set_environment(env_name):
    """Set the Django settings module environment variable.
    
    Args:
        env_name (str): Environment name ('development', 'production', 'dev', 'prod')
    """
    if env_name not in ENVIRONMENTS:
        print(f"❌ Error: Unknown environment '{env_name}'")
        print(f"Available environments: {', '.join(ENVIRONMENTS.keys())}")
        return False
    
    settings_module = ENVIRONMENTS[env_name]
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
    
    print(f"✅ Environment set to: {env_name}")
    print(f"📋 Django settings module: {settings_module}")
    return True


def get_current_environment():
    """Get the current Django settings module.
    
    Returns:
        str: Current settings module or None if not set
    """
    return os.environ.get('DJANGO_SETTINGS_MODULE')


def show_environment_info():
    """Display current environment information."""
    current = get_current_environment()
    
    print("🔧 Django Environment Information")
    print("=" * 40)
    
    if current:
        # Find environment name from settings module
        env_name = None
        for name, module in ENVIRONMENTS.items():
            if module == current:
                env_name = name
                break
        
        if env_name:
            print(f"📍 Current Environment: {env_name}")
        else:
            print(f"📍 Current Environment: Custom ({current})")
        
        print(f"⚙️  Settings Module: {current}")
    else:
        print("❌ No Django settings module set")
        print("💡 Use: python manage_env.py set <environment>")
    
    print("\n📋 Available Environments:")
    for name, module in ENVIRONMENTS.items():
        status = "(current)" if current == module else ""
        print(f"  • {name}: {module} {status}")


def main():
    """Main CLI interface."""
    if len(sys.argv) < 2:
        show_environment_info()
        return
    
    command = sys.argv[1].lower()
    
    if command == 'set':
        if len(sys.argv) < 3:
            print("❌ Error: Please specify an environment")
            print("Usage: python manage_env.py set <environment>")
            print(f"Available: {', '.join(ENVIRONMENTS.keys())}")
            return
        
        env_name = sys.argv[2].lower()
        set_environment(env_name)
    
    elif command == 'show' or command == 'info':
        show_environment_info()
    
    elif command == 'help':
        print("🔧 Django Environment Manager")
        print("=" * 30)
        print("Commands:")
        print("  set <env>    Set environment (development, production, dev, prod)")
        print("  show         Show current environment information")
        print("  info         Alias for show")
        print("  help         Show this help message")
        print("\nExamples:")
        print("  python manage_env.py set development")
        print("  python manage_env.py set prod")
        print("  python manage_env.py show")
    
    else:
        print(f"❌ Error: Unknown command '{command}'")
        print("Use 'python manage_env.py help' for available commands")


if __name__ == '__main__':
    main()