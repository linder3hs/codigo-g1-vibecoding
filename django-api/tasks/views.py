"""
Views para la aplicación de tareas.

Este módulo contiene las vistas basadas en ViewSets para manejar
las operaciones CRUD de las tareas, con autenticación, permisos
y optimizaciones de rendimiento.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Task
from .serializers import (
    TaskSerializer,
    TaskListSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer
)


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de tareas.
    
    Proporciona endpoints para:
    - Listar tareas del usuario autenticado
    - Crear nuevas tareas
    - Obtener detalles de una tarea específica
    - Actualizar tareas (completa o parcial)
    - Eliminar tareas
    - Acciones personalizadas (marcar como completada, cambiar estado)
    
    Características:
    - Filtrado automático por usuario autenticado
    - Serializers específicos para cada acción
    - Optimización de queries con select_related
    - Permisos de autenticación requeridos
    - Validación de ownership en todas las operaciones
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Retorna el queryset filtrado por el usuario autenticado.
        
        Optimizaciones incluidas:
        - select_related para evitar N+1 queries
        - Filtrado por usuario para seguridad
        - Ordenamiento por defecto
        
        Returns:
            QuerySet: Tareas del usuario autenticado ordenadas por fecha de creación
        """
        return Task.objects.select_related('user').filter(
            user=self.request.user
        ).order_by('-created_at')
    
    def get_serializer_class(self):
        """
        Retorna la clase de serializer apropiada según la acción.
        
        Estrategia de serializers:
        - list: TaskListSerializer (optimizado para listados)
        - create: TaskCreateSerializer (campos específicos para creación)
        - update/partial_update: TaskUpdateSerializer (lógica de actualización)
        - retrieve: TaskSerializer (información completa)
        - default: TaskSerializer
        
        Returns:
            class: Clase del serializer apropiado
        """
        if self.action == 'list':
            return TaskListSerializer
        elif self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer
    
    def perform_create(self, serializer):
        """
        Personaliza la creación de tareas.
        
        Funcionalidades:
        - Asigna automáticamente el usuario autenticado
        - Valida datos antes de guardar
        - Logging de creación (futuro)
        
        Args:
            serializer: Instancia del serializer validado
        """
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """
        Personaliza la actualización de tareas.
        
        Funcionalidades:
        - Valida ownership implícitamente (queryset filtrado)
        - Maneja lógica de completed_at automáticamente
        - Logging de modificaciones (futuro)
        
        Args:
            serializer: Instancia del serializer validado
        """
        serializer.save()
    
    def perform_destroy(self, instance):
        """
        Personaliza la eliminación de tareas.
        
        Funcionalidades:
        - Valida ownership implícitamente (queryset filtrado)
        - Eliminación física (no soft delete por ahora)
        - Logging de eliminación (futuro)
        
        Args:
            instance: Instancia de la tarea a eliminar
        """
        instance.delete()
    
    def _validate_status(self, new_status):
        """
        Helper method to validate task status.
        
        Args:
            new_status: Status to validate
            
        Returns:
            tuple: (is_valid, error_response)
        """
        if not new_status:
            return False, Response(
                {'detail': 'El campo "status" es requerido.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return False, Response(
                {
                    'detail': f'Estado inválido. Estados válidos: {", ".join(valid_statuses)}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return True, None
    
    @action(detail=True, methods=['patch'])
    def mark_completed(self, request):
        """
        Acción personalizada para marcar una tarea como completada.
        
        Endpoint: PATCH /api/tasks/{id}/mark_completed/
        
        Funcionalidades:
        - Marca la tarea como completada usando change_status
        - Establece completed_at automáticamente
        - Retorna la tarea actualizada
        
        Returns:
            Response: Tarea actualizada o error
        """
        # Reutilizar la lógica de change_status para consistencia
        request.data['status'] = 'completada'
        return self.change_status(request)
    
    @action(detail=True, methods=['patch'])
    def change_status(self, request):
        """
        Acción personalizada para cambiar el estado de una tarea.
        
        Endpoint: PATCH /api/tasks/{id}/change_status/
        Body: {"status": "nuevo_estado"}
        
        Estados válidos: pendiente, en_progreso, completada
        
        Args:
            request: Request object con el nuevo estado
            
        Returns:
            Response: Tarea actualizada o error de validación
        """
        task = self.get_object()
        new_status = request.data.get('status')  
        
        # Validate status using helper method
        is_valid, error_response = self._validate_status(new_status)
        if not is_valid:
            return error_response  # pyright: ignore[reportUnreachable]
        
        try:
            task.change_status(new_status)
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
            
        except ValueError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """
        Acción personalizada para filtrar tareas por estado.
        
        Endpoint: GET /api/tasks/by_status/?status=pendiente
        
        Parámetros de query:
        - status: Estado a filtrar (pendiente, en_progreso, completada)
        
        Returns:
            Response: Lista de tareas filtradas por estado
        """
        status_filter = request.query_params.get('status')
        
        # Reutilizar helper method para validación
        is_valid, error_response = self._validate_status(status_filter)
        if not is_valid:
            return error_response
        
        queryset = self.get_queryset().filter(status=status_filter)
        serializer = TaskListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed_today(self, request):
        """
        Acción personalizada para obtener tareas completadas hoy.
        
        Endpoint: GET /api/tasks/completed_today/
        
        Returns:
            Response: Lista de tareas completadas en el día actual
        """
        today = timezone.now().date()
        queryset = self.get_queryset().filter(
            status='completada',
            completed_at__date=today
        )
        
        serializer = TaskListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'tasks': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Acción personalizada para obtener estadísticas de tareas del usuario.
        
        Endpoint: GET /api/tasks/stats/
        
        Returns:
            Response: Estadísticas completas de las tareas del usuario
        """
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'pendiente': queryset.filter(status='pendiente').count(),
            'en_progreso': queryset.filter(status='en_progreso').count(),
            'completada': queryset.filter(status='completada').count(),
            'completed_today': queryset.filter(
                status='completada',
                completed_at__date=timezone.now().date()
            ).count(),
        }
        
        # Calcular porcentajes
        if stats['total'] > 0:
            stats['completion_rate'] = round(
                (stats['completada'] / stats['total']) * 100, 2
            )
        else:
            stats['completion_rate'] = 0
        
        return Response(stats)
