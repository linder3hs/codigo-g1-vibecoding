from rest_framework import serializers
from django.utils import timezone
from .utils import TaskValidationUtils


class TaskUpdateMixin:
    """
    Mixin que centraliza la lógica de actualización de tareas.
    
    Implementa el principio DRY para evitar duplicación de código
    en los métodos update() de diferentes serializers.
    
    Responsabilidades:
    - Manejo automático de completed_at basado en cambios de status
    - Actualización de timestamps
    - Manejo de errores durante la actualización
    """
    
    def handle_status_transition(self, instance, validated_data):
        """
        Maneja la lógica de transición de estados y completed_at.
        
        Args:
            instance: La instancia de la tarea
            validated_data: Los datos validados
            
        Returns:
            dict: Los datos validados actualizados con completed_at si es necesario
        """
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Si se está marcando como completada, establecer completed_at
        if old_status != 'completada' and new_status == 'completada':
            validated_data['completed_at'] = timezone.now()
        
        # Si se está cambiando de completada a otro estado, limpiar completed_at
        elif old_status == 'completada' and new_status != 'completada':
            validated_data['completed_at'] = None
            
        return validated_data
    
    def perform_update(self, instance, validated_data):
        """
        Realiza la actualización de la instancia con manejo de errores.
        
        Args:
            instance: La instancia a actualizar
            validated_data: Los datos validados
            
        Returns:
            instance: La instancia actualizada
            
        Raises:
            serializers.ValidationError: Si ocurre un error durante la actualización
        """
        try:
            # Manejar transiciones de estado
            validated_data = self.handle_status_transition(instance, validated_data)
            
            # Actualizar los campos
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            
            # Actualizar timestamp explícitamente
            instance.updated_at = timezone.now()
            
            # Guardar la instancia
            instance.save()
            
            return instance
            
        except Exception as e:
            raise serializers.ValidationError(
                f"Error al actualizar la tarea: {str(e)}"
            )
    
    def update(self, instance, validated_data):
        """
        Método update() estandarizado que usa la lógica centralizada.
        
        Args:
            instance: La instancia a actualizar
            validated_data: Los datos validados
            
        Returns:
            instance: La instancia actualizada
        """
        return self.perform_update(instance, validated_data)


class TaskRepresentationMixin:
    """
    Mixin que centraliza la lógica de representación de tareas.
    
    Implementa el principio DRY para evitar duplicación en los
    métodos to_representation() de diferentes serializers.
    """
    
    def get_task_representation(self, instance):
        """
        Obtiene la representación estándar de una tarea.
        
        Args:
            instance: La instancia de la tarea
            
        Returns:
            dict: La representación serializada de la tarea
        """
        # Importar aquí para evitar importaciones circulares
        from .serializers import TaskSerializer
        
        return TaskSerializer(instance, context=self.context).data
    
    def to_representation(self, instance):
        """
        Método to_representation() estandarizado.
        
        Args:
            instance: La instancia a representar
            
        Returns:
            dict: La representación serializada
        """
        return self.get_task_representation(instance)


class TaskValidationMixin:
    """
    Mixin que centraliza las validaciones comunes de tareas.
    
    Implementa el principio DRY para evitar duplicación de código
    en los métodos de validación de diferentes serializers.
    """
    
    def validate_task_title(self, value, for_update=False):
        """
        Valida el título de la tarea.
        
        Args:
            value: El valor del título
            for_update: Si es para actualización (incluye validación de unicidad)
            
        Returns:
            str: El valor validado
        """
        if for_update:
            return TaskValidationUtils.validate_title_for_update(
                value, 
                TaskValidationUtils.get_user_from_context(self.context),
                self.instance
            )
        else:
            return TaskValidationUtils.validate_title_complete(
                value,
                TaskValidationUtils.get_user_from_context(self.context),
                self
            )
    
    def validate_task_description(self, value, required=False):
        """
        Valida la descripción de la tarea.
        
        Args:
            value: El valor de la descripción
            required: Si el campo es requerido
            
        Returns:
            str: El valor validado
        """
        return TaskValidationUtils.validate_description_basic(value, required=required)
    
    def validate_task_status(self, value, for_creation=False):
        """
        Valida el estado de la tarea.
        
        Args:
            value: El valor del estado
            for_creation: Si es para creación de tarea
            
        Returns:
            str: El valor validado
        """
        if for_creation:
            return TaskValidationUtils.validate_status_for_creation(value)
        else:
            return TaskValidationUtils.validate_status_basic(value)
    
    def validate_ownership_and_transitions(self, attrs):
        """
        Valida la propiedad de la tarea y las transiciones de estado.
        
        Args:
            attrs: Los atributos a validar
            
        Returns:
            dict: Los atributos validados
            
        Raises:
            serializers.ValidationError: Si la validación falla
        """
        try:
            # Validar propiedad (solo para updates)
            if hasattr(self, 'instance') and self.instance:
                user = TaskValidationUtils.get_user_from_context(self.context)
                if self.instance.user != user:
                    raise serializers.ValidationError({
                        'non_field_errors': 'No tienes permisos para actualizar esta tarea.'
                    })
            
            # Validar transiciones de estado
            if 'status' in attrs and hasattr(self, 'instance') and self.instance:
                TaskValidationUtils.validate_status_transition(
                    self.instance.status,
                    attrs['status'],
                    self.instance
                )
            
            return attrs
            
        except serializers.ValidationError as e:
            raise serializers.ValidationError({
                'status': str(e)
            })