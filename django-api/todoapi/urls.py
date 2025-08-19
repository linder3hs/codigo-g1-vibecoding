from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # 🔧 Panel de administración de Django
    path('admin/', admin.site.urls),
    
    # 🔑 Endpoints de autenticación
    path('api/auth/', include('authentication.urls')),
    
    # 📚 Documentación de la API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # 📝 Próximos endpoints a incluir:
    # path('api/tasks/', include('tasks.urls')),
]
