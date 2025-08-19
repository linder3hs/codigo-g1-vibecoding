"""
URLs para la aplicación de tareas.

Este módulo configura las rutas para los endpoints de tareas
usando Django REST Framework Router para generar automáticamente
las rutas CRUD y las acciones personalizadas.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# Configurar el router para generar automáticamente las URLs
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

# Definir el namespace de la aplicación
app_name = 'tasks'

urlpatterns = [
    # Incluir todas las rutas generadas por el router
    path('api/', include(router.urls)),
]

"""
Endpoints generados automáticamente por el router:

CRUD Básico:
- GET    /api/tasks/                 - Listar todas las tareas del usuario
- POST   /api/tasks/                 - Crear nueva tarea
- GET    /api/tasks/{id}/            - Obtener detalles de una tarea
- PUT    /api/tasks/{id}/            - Actualizar tarea completa
- PATCH  /api/tasks/{id}/            - Actualizar tarea parcial
- DELETE /api/tasks/{id}/            - Eliminar tarea

Acciones Personalizadas:
- PATCH  /api/tasks/{id}/mark_completed/     - Marcar tarea como completada
- PATCH  /api/tasks/{id}/change_status/      - Cambiar estado de tarea
- GET    /api/tasks/by_status/               - Filtrar tareas por estado
- GET    /api/tasks/completed_today/         - Tareas completadas hoy
- GET    /api/tasks/stats/                   - Estadísticas de tareas

Ejemplos de uso:

1. Listar tareas:
   GET /api/tasks/
   Headers: Authorization: Bearer <token>

2. Crear tarea:
   POST /api/tasks/
   Headers: Authorization: Bearer <token>
   Body: {
       "title": "Nueva tarea",
       "description": "Descripción opcional"
   }

3. Marcar como completada:
   PATCH /api/tasks/1/mark_completed/
   Headers: Authorization: Bearer <token>

4. Cambiar estado:
   PATCH /api/tasks/1/change_status/
   Headers: Authorization: Bearer <token>
   Body: {"status": "en_progreso"}

5. Filtrar por estado:
   GET /api/tasks/by_status/?status=pendiente
   Headers: Authorization: Bearer <token>

6. Estadísticas:
   GET /api/tasks/stats/
   Headers: Authorization: Bearer <token>
"""