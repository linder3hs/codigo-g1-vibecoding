from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Task

User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer principal para el modelo Task.
    
    Proporciona funcionalidad completa para operaciones CRUD:
    - Campos de solo lectura para información del usuario
    - Campos calculados para estado y fechas
    - Validaciones básicas de campos
    - Lógica de negocio para completed_at
    """
    
    # Campo de solo lectura para mostrar información del usuario
    user = serializers.StringRelatedField(read_only=True)
    
    # Campo de solo lectura para mostrar el estado en formato legible
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Campos calculados de solo lectura
    is_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'status',
            'status_display',
            'user',
            'is_completed',
            'created_at',
            'updated_at',
            'completed_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'status_display',
            'is_completed',
            'created_at',
            'updated_at',
            'completed_at',
        ]
    
    def get_is_completed(self, obj):
        """
        Determina si la tarea está completada.
        
        Args:
            obj (Task): La instancia de tarea
            
        Returns:
            bool: True si la tarea está completada
        """
        return obj.status == 'completada'
    
    def validate_title(self, value):
        """
        Valida el título de la tarea.
        
        Args:
            value (str): El título a validar
            
        Returns:
            str: El título validado
            
        Raises:
            serializers.ValidationError: Si el título no es válido
        """
        if not value or not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío.")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El título debe tener al menos 3 caracteres.")
        
        if len(value) > 200:
            raise serializers.ValidationError("El título no puede exceder 200 caracteres.")
        
        return value.strip()
    
    def validate_status(self, value):
        """
        Valida el estado de la tarea.
        
        Args:
            value (str): El estado a validar
            
        Returns:
            str: El estado validado
            
        Raises:
            serializers.ValidationError: Si el estado no es válido
        """
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Estado inválido. Estados válidos: {', '.join(valid_statuses)}"
            )
        
        return value
    
    def update(self, instance, validated_data):
        """
        Actualiza una tarea existente con lógica de negocio para completed_at.
        
        Args:
            instance (Task): La instancia de tarea a actualizar
            validated_data (dict): Los datos validados
            
        Returns:
            Task: La instancia actualizada
        """
        # Obtener el estado anterior y nuevo
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Actualizar los campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Lógica de negocio para completed_at
        if old_status != 'completada' and new_status == 'completada':
            # Marcar como completada por primera vez
            instance.completed_at = timezone.now()
        elif old_status == 'completada' and new_status != 'completada':
            # Desmarcar como completada
            instance.completed_at = None
        
        instance.save()
        return instance


class TaskListSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para listados de tareas.
    
    Incluye solo los campos esenciales para mostrar en listas:
    - Información básica de la tarea
    - Estado legible
    - Información del usuario
    - Campos calculados útiles para UI
    """
    
    # Campo de solo lectura para mostrar el estado en formato legible
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Campo calculado para mostrar si la tarea está completada
    is_completed = serializers.SerializerMethodField()
    
    # Campo para mostrar información básica del usuario
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'status',
            'status_display',
            'user_username',
            'is_completed',
            'created_at',
            'completed_at',
        ]
        read_only_fields = fields  # Todos los campos son de solo lectura en listados
    
    def get_is_completed(self, obj):
        """
        Determina si la tarea está completada.
        
        Args:
            obj (Task): La instancia de tarea
            
        Returns:
            bool: True si la tarea está completada
        """
        return obj.status == 'completada'


class TaskCreateSerializer(serializers.ModelSerializer):
    """
    Serializer especializado para crear nuevas tareas.
    
    Incluye solo los campos necesarios para la creación:
    - Campos editables por el usuario
    - Validaciones específicas para creación
    - Asignación automática del usuario
    """
    
    class Meta:
        model = Task
        fields = [
            'title',
            'description',
            'status',
        ]
        extra_kwargs = {
            'status': {
                'default': 'pendiente',
                'help_text': 'Estado inicial de la tarea (por defecto: pendiente)'
            },
            'description': {
                'required': False,
                'allow_blank': True,
                'help_text': 'Descripción detallada de la tarea (opcional)'
            }
        }
    
    def validate_title(self, value):
        """
        Valida el título para creación.
        
        Args:
            value (str): El título a validar
            
        Returns:
            str: El título validado
        """
        if not value or not value.strip():
            raise serializers.ValidationError("El título es requerido.")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El título debe tener al menos 3 caracteres.")
        
        if len(value) > 200:
            raise serializers.ValidationError("El título no puede exceder 200 caracteres.")
        
        return value.strip()
    
    def validate_status(self, value):
        """
        Valida el estado para creación.
        
        Args:
            value (str): El estado a validar
            
        Returns:
            str: El estado validado
        """
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Estado inválido. Estados válidos: {', '.join(valid_statuses)}"
            )
        
        return value
    
    def create(self, validated_data):
        """
        Crea una nueva tarea con asignación automática del usuario.
        
        Args:
            validated_data (dict): Los datos validados
            
        Returns:
            Task: La nueva instancia de tarea
            
        Raises:
            serializers.ValidationError: Si no hay usuario en el contexto
        """
        # Obtener el usuario del contexto de la request
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError("Usuario no disponible en el contexto.")
        
        # Asignar el usuario a los datos validados
        validated_data['user'] = request.user
        
        # Si el estado es 'completada', establecer completed_at
        if validated_data.get('status') == 'completada':
            validated_data['completed_at'] = timezone.now()
        
        # Crear la tarea
        return Task.objects.create(**validated_data)


class TaskUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer especializado para actualizar tareas existentes.
    
    Características:
    - Todos los campos son opcionales para actualizaciones parciales
    - Validaciones específicas para actualización
    - Lógica de negocio para completed_at
    """
    
    class Meta:
        model = Task
        fields = [
            'title',
            'description',
            'status',
        ]
        extra_kwargs = {
            'title': {
                'required': False,
                'help_text': 'Título actualizado de la tarea'
            },
            'description': {
                'required': False,
                'allow_blank': True,
                'help_text': 'Descripción actualizada de la tarea'
            },
            'status': {
                'required': False,
                'help_text': 'Estado actualizado de la tarea'
            }
        }
    
    def validate_title(self, value):
        """
        Valida el título para actualización.
        
        Args:
            value (str): El título a validar
            
        Returns:
            str: El título validado
        """
        if value is not None:
            if not value.strip():
                raise serializers.ValidationError("El título no puede estar vacío.")
            
            if len(value.strip()) < 3:
                raise serializers.ValidationError("El título debe tener al menos 3 caracteres.")
            
            if len(value) > 200:
                raise serializers.ValidationError("El título no puede exceder 200 caracteres.")
            
            return value.strip()
        
        return value
    
    def validate_status(self, value):
        """
        Valida el estado para actualización.
        
        Args:
            value (str): El estado a validar
            
        Returns:
            str: El estado validado
        """
        if value is not None:
            valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
            
            if value not in valid_statuses:
                raise serializers.ValidationError(
                    f"Estado inválido. Estados válidos: {', '.join(valid_statuses)}"
                )
        
        return value
    
    def update(self, instance, validated_data):
        """
        Actualiza una tarea existente con lógica de negocio.
        
        Args:
            instance (Task): La instancia de tarea a actualizar
            validated_data (dict): Los datos validados
            
        Returns:
            Task: La instancia actualizada
        """
        # Obtener el estado anterior y nuevo
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Actualizar los campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Lógica de negocio para completed_at
        if old_status != 'completada' and new_status == 'completada':
            # Marcar como completada por primera vez
            instance.completed_at = timezone.now()
        elif old_status == 'completada' and new_status != 'completada':
            # Desmarcar como completada
            instance.completed_at = None
        
        instance.save()
        return instance
