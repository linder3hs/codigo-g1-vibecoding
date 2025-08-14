# 🔧 Guía de Configuración Modular - Django Settings

Este proyecto utiliza una configuración modular de Django que permite separar las configuraciones por ambiente, facilitando el desarrollo, testing y despliegue en producción.

## 📁 Estructura de Settings

```
todoapi/settings/
├── __init__.py          # Configuración por defecto (development)
├── base.py              # Configuraciones comunes
├── development.py       # Configuraciones de desarrollo
└── production.py        # Configuraciones de producción
```

## 🎯 Configuraciones por Ambiente

### 📋 Base Settings (`base.py`)
Contiene todas las configuraciones comunes compartidas entre ambientes:
- Apps instaladas (Django, DRF, apps locales)
- Middleware configuration
- Templates y archivos estáticos
- Configuración de Django REST Framework
- Configuración de SimpleJWT
- Validadores de contraseña
- Internacionalización (es-ES, America/Lima)

### 🛠️ Development Settings (`development.py`)
Configuraciones específicas para desarrollo:
- `DEBUG = True`
- Base de datos SQLite
- CORS permisivo (`CORS_ALLOW_ALL_ORIGINS = True`)
- Logging a consola
- Email backend de consola
- Cache dummy
- Browsable API habilitada

### 🚀 Production Settings (`production.py`)
Configuraciones optimizadas para producción:
- `DEBUG = False`
- Base de datos PostgreSQL
- Configuraciones de seguridad avanzadas
- CORS restrictivo con orígenes específicos
- Logging a archivos
- Configuración de email SMTP
- Cache con Redis
- Browsable API deshabilitada

## 🔄 Cambio de Ambientes

### Método 1: Variable de Entorno
```bash
# Para desarrollo (por defecto)
export DJANGO_SETTINGS_MODULE=todoapi.settings.development

# Para producción
export DJANGO_SETTINGS_MODULE=todoapi.settings.production
```

### Método 2: Archivo .env
Edita el archivo `.env` y cambia:
```env
DJANGO_SETTINGS_MODULE=todoapi.settings.production
```

### Método 3: Utility Script
Usa el script `manage_env.py` incluido:
```bash
# Mostrar ambiente actual
python manage_env.py show

# Cambiar a desarrollo
python manage_env.py set development
# o
python manage_env.py set dev

# Cambiar a producción
python manage_env.py set production
# o
python manage_env.py set prod

# Ayuda
python manage_env.py help
```

### Método 4: Comando Django directo
```bash
# Desarrollo
python manage.py runserver --settings=todoapi.settings.development

# Producción
python manage.py runserver --settings=todoapi.settings.production
```

## 🔐 Variables de Entorno Requeridas

### Para Desarrollo
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Para Producción
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/todoapi_db
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EMAIL_HOST=smtp.yourdomain.com
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your-email-password
REDIS_URL=redis://localhost:6379/1
```

## 🚀 Comandos Útiles

### Verificar Configuración Actual
```bash
# Mostrar configuración actual
python manage.py diffsettings

# Verificar configuración específica
python manage.py shell -c "from django.conf import settings; print(settings.DEBUG)"
```

### Migraciones por Ambiente
```bash
# Desarrollo
python manage.py makemigrations
python manage.py migrate

# Producción
DJANGO_SETTINGS_MODULE=todoapi.settings.production python manage.py migrate
```

### Recolectar Archivos Estáticos (Producción)
```bash
DJANGO_SETTINGS_MODULE=todoapi.settings.production python manage.py collectstatic
```

## 🔍 Verificación de Configuración

### Script de Verificación
Crea un script para verificar que la configuración esté correcta:

```python
# check_config.py
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todoapi.settings.development')
django.setup()

print(f"Settings Module: {settings.SETTINGS_MODULE}")
print(f"Debug Mode: {settings.DEBUG}")
print(f"Database: {settings.DATABASES['default']['ENGINE']}")
print(f"Allowed Hosts: {settings.ALLOWED_HOSTS}")
```

## 🛡️ Mejores Prácticas

### Seguridad
1. **Nunca** commitear el archivo `.env` al repositorio
2. Usar diferentes `SECRET_KEY` para cada ambiente
3. Configurar `DEBUG = False` en producción
4. Restringir `ALLOWED_HOSTS` en producción
5. Usar HTTPS en producción (`SECURE_SSL_REDIRECT = True`)

### Performance
1. Usar PostgreSQL en producción
2. Configurar cache con Redis en producción
3. Deshabilitar Browsable API en producción
4. Configurar archivos estáticos correctamente

### Mantenimiento
1. Mantener `base.py` con configuraciones comunes
2. Documentar cambios en configuraciones específicas
3. Usar variables de entorno para valores sensibles
4. Probar configuraciones en ambiente de staging

## 🔧 Troubleshooting

### Error: "No module named 'todoapi.settings'"
```bash
# Verificar que estés en el directorio correcto
pwd
# Debe mostrar: /path/to/django-api

# Verificar estructura de archivos
ls todoapi/settings/
# Debe mostrar: __init__.py base.py development.py production.py
```

### Error: "ImproperlyConfigured"
```bash
# Verificar variables de entorno
python -c "import os; print(os.environ.get('DJANGO_SETTINGS_MODULE'))"

# Verificar archivo .env
cat .env | grep DJANGO_SETTINGS_MODULE
```

### Error de Base de Datos
```bash
# Verificar configuración de base de datos
python manage.py dbshell

# Para PostgreSQL, verificar conexión
psql $DATABASE_URL
```

## 📚 Referencias

- [Django Settings Documentation](https://docs.djangoproject.com/en/5.0/topics/settings/)
- [Django REST Framework Settings](https://www.django-rest-framework.org/api-guide/settings/)
- [12-Factor App Methodology](https://12factor.net/config)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)

---

**Última actualización:** $(date)  
**Versión:** 1.0  
**Mantenido por:** Equipo de Desarrollo