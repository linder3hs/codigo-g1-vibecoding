from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task
from .utils import TaskValidationUtils
from .mixins import TaskUpdateMixin, TaskRepresentationMixin, TaskValidationMixin

User = get_user_model()


# Constantes para campos reutilizables en serializers
class TaskSerializerFields:
    """
    Constantes para centralizar definiciones de campos en serializers.
    
    Esto evita duplicación y facilita el mantenimiento de campos
    que se usan en múltiples serializers.
    """
    
    # Campos básicos del modelo Task
    BASIC_FIELDS = [
        'id',
        'title',
        'description',
        'status',
    ]
    
    # Campos de solo lectura comunes
    READONLY_FIELDS = [
        'id',
        'user',
        'created_at',
        'updated_at',
        'completed_at',
    ]
    
    # Campos calculados y de display
    DISPLAY_FIELDS = [
        'status_display',
        'is_completed',
        'is_overdue',
    ]
    
    # Campos para listados optimizados
    LIST_FIELDS = [
        'id',
        'title',
        'status',
        'status_display',
        'user_username',
        'created_at',
        'completed_at',
        'is_completed',
        'time_since_created',
    ]
    
    # Campos para creación
    CREATE_FIELDS = [
        'title',
        'description',
        'status',
    ]
    
    # Campos para actualización
    UPDATE_FIELDS = [
        'title',
        'description',
        'status',
    ]
    
    # Campos completos para serializer principal
    FULL_FIELDS = BASIC_FIELDS + ['user'] + ['created_at', 'updated_at', 'completed_at'] + DISPLAY_FIELDS
    
    # Campos de solo lectura para serializer principal
    FULL_READONLY_FIELDS = READONLY_FIELDS + DISPLAY_FIELDS


class TaskSerializer(TaskUpdateMixin, TaskRepresentationMixin, TaskValidationMixin, serializers.ModelSerializer):
    """
    Serializer principal para el modelo Task con validación y lógica de negocio completa.
    
    Hereda de:
    - TaskUpdateMixin: Para lógica de actualización centralizada
    - TaskRepresentationMixin: Para representaciones personalizadas
    - TaskValidationMixin: Para validaciones centralizadas
    
    Responsabilidades:
    - Operaciones CRUD completas para tareas
    - Validaciones avanzadas de campos
    - Lógica de negocio para timestamps
    - Validación de propiedad de usuario
    - Representaciones personalizadas de campos
    """
    
    # Campo de solo lectura para mostrar información del usuario
    user = serializers.StringRelatedField(read_only=True)
    
    # Campo de solo lectura para mostrar el estado en formato legible
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Campos calculados de solo lectura
    is_completed = serializers.BooleanField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Task
        fields = TaskSerializerFields.FULL_FIELDS
        read_only_fields = TaskSerializerFields.FULL_READONLY_FIELDS
    
    def validate_title(self, value):
        """
        Valida el título usando el mixin centralizado.
        """
        return self.validate_task_title(value, for_update=bool(self.instance))
    
    def validate_description(self, value):
        """
        Valida la descripción usando el mixin centralizado.
        """
        return self.validate_task_description(value, required=False)
    
    def validate_status(self, value):
        """
        Valida el estado usando el mixin centralizado.
        """
        return self.validate_task_status(value, for_creation=False)
    
    def validate(self, attrs):
        """
        Validación a nivel de objeto usando validación centralizada.
        """
        return TaskValidationUtils.validate_complete_serializer_data(
            attrs, 
            self.context, 
            instance=self.instance, 
            for_creation=not bool(self.instance)
        )
    
    # El método update() se hereda del TaskUpdateMixin
    # No necesitamos redefinirlo aquí


class TaskListSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para listados de tareas.
    
    Este serializer está diseñado específicamente para operaciones de listado
    donde necesitamos mostrar información mínima pero esencial de las tareas.
    
    Características:
    - Campos mínimos para mejor rendimiento
    - Información calculada útil para UI
    - Solo lectura (no permite modificaciones)
    - Optimizado para queries masivos
    
    Casos de uso:
    - GET /api/tasks/ (listado principal)
    - Componentes de lista en frontend
    - APIs públicas con información limitada
    - Dashboards y resúmenes
    """
    
    # Campo de solo lectura para mostrar el estado en formato legible
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Campo calculado para mostrar si la tarea está completada
    is_completed = serializers.SerializerMethodField()
    
    # Campo calculado para mostrar tiempo transcurrido desde creación
    time_since_created = serializers.SerializerMethodField()
    
    # Campo para mostrar información básica del usuario (solo username)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Task
        fields = TaskSerializerFields.LIST_FIELDS
        read_only_fields = TaskSerializerFields.LIST_FIELDS  # Todos los campos son de solo lectura en listados
    
    def get_is_completed(self, obj):
        """
        Determina si la tarea está completada.
        
        Args:
            obj (Task): La instancia de tarea
            
        Returns:
            bool: True si la tarea está completada, False en caso contrario
        """
        return TaskValidationUtils.is_task_completed(obj)
    
    def get_time_since_created(self, obj):
        """
        Calcula el tiempo transcurrido desde la creación de la tarea.
        
        Args:
            obj (Task): La instancia de tarea
            
        Returns:
            str: Tiempo transcurrido en formato legible
        """
        return TaskValidationUtils.get_time_since_created(obj)
    
    def to_representation(self, instance):
        """
        Personaliza la representación de la tarea para listados.
        
        Args:
            instance (Task): La instancia de tarea
            
        Returns:
            dict: Representación personalizada de la tarea
        """
        data = super().to_representation(instance)
        
        # Truncar título si es muy largo para listados
        data['title'] = TaskValidationUtils.truncate_title(data.get('title'), 50)
        
        # Agregar información adicional útil para UI
        data['priority_class'] = TaskValidationUtils.get_priority_class(instance)
        data['status_color'] = TaskValidationUtils.get_status_color(instance.status)
        
        return data
    
    # Los métodos _get_priority_class y _get_status_color han sido movidos
    # a TaskValidationUtils como funciones utilitarias reutilizables


class TaskCreateSerializer(TaskRepresentationMixin, TaskValidationMixin, serializers.ModelSerializer):
    """
    Serializer especializado para crear nuevas tareas.
    
    Hereda de:
    - TaskRepresentationMixin: Para representaciones consistentes
    - TaskValidationMixin: Para validaciones centralizadas
    
    Optimizado para creación de tareas con:
    - Solo campos esenciales para creación
    - Asignación automática de usuario desde contexto
    - Manejo de estado por defecto
    - Validación completa para nuevas tareas
    - Gestión automática de timestamps
    """
    
    class Meta:
        model = Task
        fields = TaskSerializerFields.CREATE_FIELDS
        extra_kwargs = {
            'status': {
                'default': 'pendiente',
                'help_text': 'Initial status of the task (defaults to pendiente)'
            },
            'description': {
                'required': False,
                'allow_blank': True,
                'help_text': 'Optional detailed description of the task'
            }
        }
    
    def validate_title(self, value):
        """
        Valida el título para creación usando el mixin centralizado.
        """
        return self.validate_task_title(value, for_update=False)
    
    def validate_description(self, value):
        """
        Valida la descripción para creación usando el mixin centralizado.
        """
        return self.validate_task_description(value, required=False)
    
    def validate_status(self, value):
        """
        Valida el estado para creación usando el mixin centralizado.
        """
        return self.validate_task_status(value, for_creation=True)
    
    def validate(self, attrs):
        """
        Validación a nivel de objeto para creación usando validación centralizada.
        """
        return TaskValidationUtils.validate_complete_serializer_data(
            attrs, 
            self.context, 
            instance=None, 
            for_creation=True
        )
    
    def create(self, validated_data):
        """
        Custom create method with automatic user assignment and logging.
        
        Args:
            validated_data (dict): The validated data for creating the task
            
        Returns:
            Task: The newly created task instance
            
        Raises:
            serializers.ValidationError: If user is not available or creation fails
        """
        # Get the user using utils function
        user = TaskValidationUtils.get_user_from_context(self.context, required=True)
        
        # Assign the user to the validated data
        validated_data['user'] = user
        
        # Set created_at explicitly (though auto_now_add should handle this)
        from django.utils import timezone
        validated_data['created_at'] = timezone.now()
        
        # If status is 'completada', set completed_at (though this shouldn't happen)
        if validated_data.get('status') == 'completada':
            validated_data['completed_at'] = timezone.now()
        
        try:
            # Create the task instance
            task = Task.objects.create(**validated_data)
            
            # Optional: Log the creation (you can implement logging later)
            # logger.info(f"Task created: {task.id} by user {user.id}")
            
            return task
            
        except Exception as e:
            # Handle any database errors
            raise serializers.ValidationError(
                f"Error al crear la tarea: {str(e)}"
            )
    
    # El método to_representation() se hereda del TaskRepresentationMixin
    # No necesitamos redefinirlo aquí


class TaskUpdateSerializer(TaskUpdateMixin, TaskRepresentationMixin, TaskValidationMixin, serializers.ModelSerializer):
    """
    Serializer especializado para actualizar tareas existentes.
    
    Hereda de:
    - TaskUpdateMixin: Para lógica de actualización centralizada
    - TaskRepresentationMixin: Para representaciones consistentes
    - TaskValidationMixin: Para validaciones centralizadas
    
    Características clave:
    - Actualizaciones parciales con validación por campo
    - Validación de transiciones de estado
    - Validación de propiedad (usuarios solo pueden actualizar sus tareas)
    - Lógica de negocio para timestamps de completed_at
    - Restricciones en actualizaciones de tareas completadas
    """
    
    class Meta:
        model = Task
        fields = TaskSerializerFields.UPDATE_FIELDS
        extra_kwargs = {
            'title': {
                'required': False,
                'help_text': 'Updated title of the task'
            },
            'description': {
                'required': False,
                'allow_blank': True,
                'help_text': 'Updated description of the task'
            },
            'status': {
                'required': False,
                'help_text': 'Updated status of the task'
            }
        }
    
    def validate_title(self, value):
        """
        Valida el título para actualización usando el mixin centralizado.
        """
        return self.validate_task_title(value, for_update=True)
    
    def validate_description(self, value):
        """
        Valida la descripción para actualización usando el mixin centralizado.
        """
        return self.validate_task_description(value, required=False)
    
    def validate_status(self, value):
        """
        Valida el estado para actualización usando el mixin centralizado.
        """
        return self.validate_task_status(value, for_creation=False)
    
    def validate(self, attrs):
        """
        Validación a nivel de objeto para actualización usando validación centralizada.
        """
        return TaskValidationUtils.validate_complete_serializer_data(
            attrs, 
            self.context, 
            instance=self.instance, 
            for_creation=False
        )
