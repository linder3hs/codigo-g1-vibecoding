"""
Utility functions for task validation.

This module contains reusable validation functions that can be used
across different serializers to maintain DRY (Don't Repeat Yourself) principles.
"""

from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError


class TaskValidationUtils:
    """
    Utility class containing common validation methods for Task-related operations.
    
    This class provides static methods for validating task fields consistently
    across different serializers, ensuring code reusability and maintainability.
    """
    
    # Common validation constants
    TITLE_MIN_LENGTH = 3
    TITLE_MAX_LENGTH = 200
    DESCRIPTION_MIN_LENGTH = 5
    DESCRIPTION_MAX_LENGTH = 1000
    FORBIDDEN_CHARS = ['<', '>', '{', '}', '[', ']', '&', '"', "'"]
    
    @staticmethod
    def validate_title_basic(value, field_name="título"):
        """
        Basic title validation that can be used across different serializers.
        
        Args:
            value (str): The title value to validate
            field_name (str): The name of the field for error messages
            
        Returns:
            str: The cleaned and validated title
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        # Check for empty or None values
        if not value or not value.strip():
            raise serializers.ValidationError(
                f"El {field_name} es obligatorio y no puede estar vacío."
            )
        
        # Clean the title
        cleaned_value = value.strip()
        
        # Minimum length validation
        if len(cleaned_value) < TaskValidationUtils.TITLE_MIN_LENGTH:
            raise serializers.ValidationError(
                f"El {field_name} debe tener al menos {TaskValidationUtils.TITLE_MIN_LENGTH} caracteres."
            )
        
        # Maximum length validation
        if len(cleaned_value) > TaskValidationUtils.TITLE_MAX_LENGTH:
            raise serializers.ValidationError(
                f"El {field_name} no puede exceder los {TaskValidationUtils.TITLE_MAX_LENGTH} caracteres."
            )
        
        # Check for forbidden characters
        if any(char in cleaned_value for char in TaskValidationUtils.FORBIDDEN_CHARS):
            raise serializers.ValidationError(
                f"El {field_name} contiene caracteres no permitidos."
            )
        
        # Check for only whitespace or special characters
        if not any(c.isalnum() for c in cleaned_value):
            raise serializers.ValidationError(
                f"El {field_name} debe contener al menos un carácter alfanumérico."
            )
        
        return cleaned_title
    
    @staticmethod
    def validate_title_uniqueness(cleaned_title, user, exclude_instance=None):
        """
        Validate title uniqueness for a specific user.
        
        Args:
            cleaned_title (str): The cleaned title to check
            user: The user instance
            exclude_instance: Task instance to exclude from uniqueness check (for updates)
            
        Raises:
            serializers.ValidationError: If title is not unique
        """
        from .models import Task  # Import here to avoid circular imports
        
        if not user or not user.is_authenticated:
            return  # Skip uniqueness check if no user context
        
        query = Task.objects.filter(
            user=user,
            title__iexact=cleaned_title
        )
        
        # Exclude current instance for updates
        if exclude_instance:
            query = query.exclude(pk=exclude_instance.pk)
        
        if query.exists():
            raise serializers.ValidationError(
                "Ya tienes una tarea con este título. Los títulos deben ser únicos."
            )
    
    @staticmethod
    def validate_title_complete(value, user=None, exclude_instance=None, field_name="título"):
        """
        Complete title validation including uniqueness check.
        
        Args:
            value (str): The title value to validate
            user: The user instance for uniqueness check
            exclude_instance: Task instance to exclude from uniqueness check
            field_name (str): The name of the field for error messages
            
        Returns:
            str: The cleaned and validated title
        """
        # Basic validation
        cleaned_title = TaskValidationUtils.validate_title_basic(value, field_name)
        
        # Uniqueness validation if user is provided
        if user:
            TaskValidationUtils.validate_title_uniqueness(cleaned_title, user, exclude_instance)
        
        return cleaned_value
    
    @staticmethod
    def validate_title_for_update(value, user=None, exclude_instance=None, field_name="título"):
        """
        Specialized title validation for updates.
        
        This method performs title validation specifically for update operations,
        including uniqueness checks that exclude the current instance.
        
        Args:
            value (str): The title value to validate
            user: The user instance for uniqueness validation
            exclude_instance: The current task instance to exclude from uniqueness check
            field_name (str): The name of the field for error messages
            
        Returns:
            str: The cleaned and validated title
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        # First, perform basic title validation
        cleaned_value = TaskValidationUtils.validate_title_basic(value, field_name)
        
        # Then, perform uniqueness validation excluding current instance
        TaskValidationUtils.validate_title_uniqueness(
            cleaned_value, 
            user, 
            exclude_instance=exclude_instance
        )
        
        return cleaned_value
    
    @staticmethod
    def validate_description_basic(value, required=False, field_name="descripción"):
        """
        Basic description validation.
        
        Args:
            value (str): The description value to validate
            required (bool): Whether the description is required
            field_name (str): The name of the field for error messages
            
        Returns:
            str or None: The cleaned description or None if empty and not required
        """
        # Handle None or empty values
        if not value:
            if required:
                raise serializers.ValidationError(
                    f"La {field_name} es obligatoria."
                )
            return None
        
        # Clean the description
        cleaned_value = value.strip()
        
        # If empty after cleaning
        if not cleaned_value:
            if required:
                raise serializers.ValidationError(
                    f"La {field_name} no puede estar vacía."
                )
            return None
        
        # Maximum length validation
        if len(cleaned_value) > TaskValidationUtils.DESCRIPTION_MAX_LENGTH:
            raise serializers.ValidationError(
                f"La {field_name} no puede exceder los {TaskValidationUtils.DESCRIPTION_MAX_LENGTH} caracteres."
            )
        
        # Minimum length validation (only if provided)
        if len(cleaned_value) < TaskValidationUtils.DESCRIPTION_MIN_LENGTH:
            raise serializers.ValidationError(
                f"La {field_name} debe tener al menos {TaskValidationUtils.DESCRIPTION_MIN_LENGTH} caracteres si se proporciona."
            )
        
        return cleaned_value
    
    @staticmethod
    def validate_status_basic(value, field_name="estado"):
        """
        Basic status validation.
        
        Args:
            value (str): The status value to validate
            field_name (str): The name of the field for error messages
            
        Returns:
            str: The validated status
        """
        from .models import Task  # Import here to avoid circular imports
        
        # Get valid statuses from model
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"{field_name.capitalize()} inválido. Los estados válidos son: {', '.join(valid_statuses)}"
            )
        
        return value
    
    @staticmethod
    def validate_status_for_creation(value, field_name="estado"):
        """
        Status validation specifically for task creation.
        
        Args:
            value (str): The status value to validate
            field_name (str): The name of the field for error messages
            
        Returns:
            str: The validated status
        """
        # Basic validation first
        validated_status = TaskValidationUtils.validate_status_basic(value, field_name)
        
        # For creation, restrict certain statuses
        if validated_status == 'completada':
            raise serializers.ValidationError(
                "Una nueva tarea no puede crearse con estado 'completada'. "
                "Use 'pendiente' o 'en_progreso'."
            )
        
        return validated_status
    
    @staticmethod
    def validate_status_transition(current_status, new_status, field_name="estado"):
        """
        Validate status transitions for task updates.
        
        Args:
            current_status (str): The current status of the task
            new_status (str): The new status to transition to
            field_name (str): The name of the field for error messages
            
        Raises:
            serializers.ValidationError: If transition is not valid
        """
        # Define valid transitions
        valid_transitions = {
            'pendiente': ['en_progreso', 'completada'],
            'en_progreso': ['pendiente', 'completada'],
            'completada': ['pendiente', 'en_progreso'],  # Allow reopening tasks
        }
        
        # Check if transition is valid
        if (current_status != new_status and 
            new_status not in valid_transitions.get(current_status, [])):
            raise serializers.ValidationError(
                f"No se puede cambiar de '{current_status}' a '{new_status}'"
            )
    
    @staticmethod
    def get_user_from_context(context, required=True):
        """
        Extract user from serializer context.
        
        Args:
            context (dict): The serializer context
            required (bool): Whether user is required
            
        Returns:
            User or None: The user instance or None if not required
            
        Raises:
            serializers.ValidationError: If user is required but not found
        """
        request = context.get('request')
        
        if not request or not hasattr(request, 'user'):
            if required:
                raise serializers.ValidationError(
                    "No se pudo obtener el usuario del contexto de la solicitud."
                )
            return None
        
        user = request.user
        
        if required and not user.is_authenticated:
            raise serializers.ValidationError(
                "El usuario debe estar autenticado."
            )
        
        return user if user.is_authenticated else None
    
    @staticmethod
    def validate_ownership(instance, user):
        """
        Valida que el usuario sea propietario de la tarea.
        
        Args:
            instance: La instancia de la tarea
            user: El usuario a validar
            
        Raises:
            serializers.ValidationError: Si el usuario no es propietario
        """
        if instance.user != user:
            raise serializers.ValidationError(
                "No tienes permisos para realizar esta acción en esta tarea."
            )
    
    @staticmethod
    def validate_completed_task_restrictions(instance, validated_data):
        """
        Valida las restricciones para tareas completadas.
        
        Args:
            instance: La instancia de la tarea
            validated_data: Los datos a validar
            
        Raises:
            serializers.ValidationError: Si se intenta modificar campos no permitidos
        """
        if instance.status == 'completada':
            # Solo se puede modificar la descripción en tareas completadas
            forbidden_fields = [field for field in validated_data.keys() 
                              if field not in ['description']]
            
            if forbidden_fields:
                raise serializers.ValidationError({
                    'non_field_errors': f"No se pueden modificar los campos {forbidden_fields} en una tarea completada. Solo se puede actualizar la descripción."
                })
    
    @staticmethod
    def validate_complete_serializer_data(attrs, context, instance=None, for_creation=False):
        """
        Realiza validación completa de datos del serializer.
        
        Args:
            attrs: Los atributos a validar
            context: El contexto del serializer
            instance: La instancia (para updates)
            for_creation: Si es para creación de tarea
            
        Returns:
            dict: Los atributos validados
            
        Raises:
            serializers.ValidationError: Si la validación falla
        """
        try:
            user = TaskValidationUtils.get_user_from_context(context)
            
            # Validar propiedad (solo para updates)
            if instance and not for_creation:
                TaskValidationUtils.validate_ownership(instance, user)
                
                # Validar restricciones de tareas completadas
                TaskValidationUtils.validate_completed_task_restrictions(instance, attrs)
            
            # Validar transiciones de estado
            if 'status' in attrs and instance and not for_creation:
                TaskValidationUtils.validate_status_transition(
                    instance.status,
                    attrs['status']
                )
            
            return attrs
            
        except serializers.ValidationError:
            raise
        except Exception as e:
            raise serializers.ValidationError(
                f"Error durante la validación: {str(e)}"
            )
    
    @staticmethod
    def get_time_since_created(task_instance):
        """
        Calcula el tiempo transcurrido desde la creación de una tarea.
        
        Args:
            task_instance (Task): La instancia de tarea
            
        Returns:
            str: Tiempo transcurrido en formato legible
        """
        from django.utils import timezone
        from django.utils.timesince import timesince
        
        if task_instance.created_at:
            return timesince(task_instance.created_at, timezone.now())
        return 'Desconocido'
    
    @staticmethod
    def get_priority_class(task_instance):
        """
        Determina la clase CSS de prioridad basada en el estado y tiempo.
        
        Args:
            task_instance (Task): La instancia de tarea
            
        Returns:
            str: Clase CSS para prioridad visual
        """
        from django.utils import timezone
        
        if task_instance.status == 'completada':
            return 'completed'
        
        # Calcular si es una tarea antigua (más de 7 días)
        if task_instance.created_at:
            days_old = (timezone.now() - task_instance.created_at).days
            if days_old > 7:
                return 'high-priority'
            elif days_old > 3:
                return 'medium-priority'
        
        return 'normal-priority'
    
    @staticmethod
    def get_status_color(status):
        """
        Mapea estados a colores para UI.
        
        Args:
            status (str): El estado de la tarea
            
        Returns:
            str: Color hexadecimal para el estado
        """
        status_colors = {
            'pendiente': '#fbbf24',      # Amarillo
            'en_progreso': '#3b82f6',    # Azul
            'completada': '#10b981',     # Verde
        }
        return status_colors.get(status, '#6b7280')  # Gris por defecto
    
    @staticmethod
    def truncate_title(title, max_length=50):
        """
        Trunca un título si excede la longitud máxima.
        
        Args:
            title (str): El título a truncar
            max_length (int): Longitud máxima permitida
            
        Returns:
            str: Título truncado con '...' si es necesario
        """
        if title and len(title) > max_length:
            return title[:max_length-3] + '...'
        return title
    
    @staticmethod
    def is_task_completed(task_instance):
        """
        Determina si una tarea está completada.
        
        Args:
            task_instance (Task): La instancia de tarea
            
        Returns:
            bool: True si la tarea está completada, False en caso contrario
        """
        return task_instance.status == 'completada'


# Convenience functions for backward compatibility and easier imports
def validate_task_title(value, user=None, exclude_instance=None):
    """Convenience function for complete title validation."""
    return TaskValidationUtils.validate_title_complete(value, user, exclude_instance)


def validate_task_description(value, required=False):
    """Convenience function for description validation."""
    return TaskValidationUtils.validate_description_basic(value, required)


def validate_task_status(value, for_creation=False, current_status=None):
    """Convenience function for status validation."""
    if for_creation:
        return TaskValidationUtils.validate_status_for_creation(value)
    
    validated_status = TaskValidationUtils.validate_status_basic(value)
    
    if current_status and current_status != validated_status:
        TaskValidationUtils.validate_status_transition(current_status, validated_status)
    
    return validated_status
