from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Task(models.Model):
    """
    Modelo para representar una tarea en el sistema TODO.
    
    Cada tarea pertenece a un usuario específico y tiene un estado
    que puede cambiar a lo largo de su ciclo de vida.
    """
    
    # Choices para el campo status
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
    ]
    
    # Campos principales
    title = models.CharField(
        max_length=200,
        verbose_name="Title",
        help_text="Descriptive title of the task (maximum 200 characters)"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Description",
        help_text="Detailed description of the task (optional)"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendiente',
        verbose_name="Status",
        help_text="Current status of the task"
    )
    
    # Relación con el usuario
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name="User",
        help_text="Owner of the task"
    )
    
    # Campos de timestamp
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created at",
        help_text="Date and time when the task was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated at",
        help_text="Date and time of the last update"
    )
    
    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Completed at",
        help_text="Date and time when the task was marked as completed"
    )
    
    class Meta:
        db_table = 'tasks'
        verbose_name = "Task"
        verbose_name_plural = "Tasks"
        ordering = ['-created_at']  # Ordenar por fecha de creación descendente
        indexes = [
            models.Index(fields=['user', 'status']),  # Índice compuesto para optimizar queries
            models.Index(fields=['created_at']),      # Índice para ordenamiento
            models.Index(fields=['status']),          # Índice para filtros por estado
        ]
    
    def __str__(self):
        """
        Representación en string del modelo.
        Muestra el título y el estado actual.
        """
        return f"{self.title} ({self.get_status_display()})"
    
    def mark_as_completed(self):
        """
        Marca la tarea como completada y establece la fecha de completado.
        
        Returns:
            bool: True si la tarea fue marcada como completada, False si ya estaba completada
        """
        if self.status != 'completada':
            self.status = 'completada'
            self.completed_at = timezone.now()
            self.save(update_fields=['status', 'completed_at', 'updated_at'])
            return True
        return False
    
    def mark_as_pending(self):
        """
        Marca la tarea como pendiente y limpia la fecha de completado.
        
        Returns:
            bool: True si el estado cambió, False si ya estaba pendiente
        """
        if self.status != 'pendiente':
            self.status = 'pendiente'
            self.completed_at = None
            self.save(update_fields=['status', 'completed_at', 'updated_at'])
            return True
        return False
    
    def mark_as_in_progress(self):
        """
        Marca la tarea como en progreso y limpia la fecha de completado.
        
        Returns:
            bool: True si el estado cambió, False si ya estaba en progreso
        """
        if self.status != 'en_progreso':
            self.status = 'en_progreso'
            self.completed_at = None
            self.save(update_fields=['status', 'completed_at', 'updated_at'])
            return True
        return False
    
    def change_status(self, new_status):
        """
        Cambia el estado de la tarea con validaciones.
        
        Args:
            new_status (str): Nuevo estado para la tarea
            
        Returns:
            bool: True si el estado cambió exitosamente, False en caso contrario
            
        Raises:
            ValueError: Si el nuevo estado no es válido
        """
        valid_statuses = [choice[0] for choice in self.STATUS_CHOICES]
        
        if new_status not in valid_statuses:
            raise ValueError(f"Estado inválido: {new_status}. Estados válidos: {valid_statuses}")
        
        if self.status != new_status:
            old_status = self.status
            self.status = new_status
            
            # Manejar completed_at según el nuevo estado
            if new_status == 'completada':
                self.completed_at = timezone.now()
            else:
                self.completed_at = None
            
            self.save(update_fields=['status', 'completed_at', 'updated_at'])
            return True
        
        return False
    
    @property
    def is_completed(self):
        """
        Propiedad que indica si la tarea está completada.
        
        Returns:
            bool: True si la tarea está completada, False en caso contrario
        """
        return self.status == 'completada'
    
    @property
    def is_overdue(self):
        """
        Propiedad que indica si la tarea está atrasada.
        Por ahora retorna False ya que no tenemos fecha límite.
        
        Returns:
            bool: False (funcionalidad futura)
        """
        # TODO: Implementar cuando se agregue campo due_date
        return False
    
    def get_duration_since_creation(self):
        """
        Calcula el tiempo transcurrido desde la creación de la tarea.
        
        Returns:
            timedelta: Tiempo transcurrido desde la creación
        """
        return timezone.now() - self.created_at
    
    def get_completion_time(self):
        """
        Calcula el tiempo que tomó completar la tarea.
        
        Returns:
            timedelta or None: Tiempo de completado si está completada, None en caso contrario
        """
        if self.is_completed and self.completed_at:
            return self.completed_at - self.created_at
        return None
