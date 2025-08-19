from django.urls import path
from . import views

# URLs para la aplicación de autenticación
# Namespace: 'auth' para organizar las rutas

app_name = 'authentication'

urlpatterns = [
    # 🔑 Endpoint de Registro
    # POST /api/auth/register/
    path('register/', views.register_user, name='register'),
    
    # 📝 Próximos endpoints a implementar:
    # path('login/', views.login_user, name='login'),
    # path('logout/', views.logout_user, name='logout'),
    # path('profile/', views.user_profile, name='profile'),
    # path('change-password/', views.change_password, name='change_password'),
]