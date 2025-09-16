# Docker Setup for Django TODO API

This document provides instructions for running the Django TODO API project using Docker in both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Project Structure

```bash
django-api/
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.dev.yml       # Development environment
├── docker-compose.prod.yml      # Production environment
├── nginx/
│   └── nginx.conf               # Nginx configuration for production
├── .env.development             # Development environment variables
├── .env.production              # Production environment variables
└── ... (Django project files)
```

## Development Environment

### Setup

1. **Clone the repository and navigate to the project directory:**

   ```bash
   git clone <repository-url>
   cd django-api
   ```

2. **Copy the development environment file:**

   ```bash
   cp .env.development .env.development.local  # Optional: for local overrides
   ```

3. **Build and start the development containers:**

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   Or run in detached mode:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build -d
   ```

### Database Setup

The first time you run the containers, you need to create and run migrations:

```bash
# Run migrations
docker-compose -f docker-compose.dev.yml exec django python manage.py migrate

# Create a superuser (optional)
docker-compose -f docker-compose.dev.yml exec django python manage.py createsuperuser

# Collect static files
docker-compose -f docker-compose.dev.yml exec django python manage.py collectstatic --noinput
```

### Access the Application

- **Django API:** http://localhost:8000
- **Django Admin:** http://localhost:8000/admin/
- **API Documentation:** http://localhost:8000/api/docs/ (if configured)
- **PostgreSQL Database:** localhost:5433 (accessible from host for debugging)

### Development Workflow

1. **Make code changes:** Edit files in your local directory (changes are reflected immediately due to volume mounting)

2. **Run Django management commands:**

   ```bash
   docker-compose -f docker-compose.dev.yml exec django python manage.py <command>
   ```

3. **View logs:**

   ```bash
   docker-compose -f docker-compose.dev.yml logs -f django
   ```

4. **Stop containers:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Useful Development Commands

```bash
# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build --force-recreate

# Run tests
docker-compose -f docker-compose.dev.yml exec django python manage.py test

# Create new app
docker-compose -f docker-compose.dev.yml exec django python manage.py startapp <app_name>

# Make migrations
docker-compose -f docker-compose.dev.yml exec django python manage.py makemigrations

# Run migrations
docker-compose -f docker-compose.dev.yml exec django python manage.py migrate
```

## Production Environment

### Setup

1. **Prepare environment variables:**

   ```bash
   cp .env.production .env.production.local
   ```

   Edit `.env.production.local` and update the following critical values:

   - `SECRET_KEY`: Generate a new secret key
   - `ALLOWED_HOSTS`: Your actual domain(s)
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `CORS_ALLOWED_ORIGINS`: Your frontend domain(s)
   - `POSTGRES_PASSWORD`: Secure password for database
   - Email settings if needed

2. **SSL Certificates (Optional but Recommended):**

   ```bash
   # Place your SSL certificates in nginx/ssl/
   # cert.pem and key.pem
   ```

3. **Build and start production containers:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Database Setup for Production

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec django python manage.py migrate

# Create superuser
docker-compose -f docker-compose.prod.yml exec django python manage.py createsuperuser

# Collect static files
docker-compose -f docker-compose.prod.yml exec django python manage.py collectstatic --noinput
```

### Access the Application

- **Application:** http://localhost (or your domain if configured)
- **PostgreSQL Database:** localhost:5432

### Production Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale Django workers (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale django=4

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U todoapi_prod_user todoapi_prod > backup.sql

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## Environment Variables

### Development (.env.development)

- Uses PostgreSQL in Docker container
- Debug mode enabled
- Permissive CORS settings
- Console email backend

### Production (.env.production)

- Uses external PostgreSQL (configure DATABASE_URL)
- Debug mode disabled
- Strict CORS settings
- SMTP email backend
- SSL redirect enabled

## Docker Images

### Multi-stage Build

The Dockerfile uses a multi-stage build for optimization:

- **Builder stage:** Installs all dependencies and builds the application
- **Runtime stage:** Contains only necessary runtime files, resulting in a smaller image

### Image Size Optimization

- Uses Python slim base image
- Removes build dependencies in runtime stage
- Uses virtual environment
- Non-root user for security

## Networking

### Development

- Custom network: `todoapi_network`
- PostgreSQL accessible on host port 5433
- Django accessible on host port 8000

### Production

- Custom network: `todoapi_network`
- Nginx handles static files and proxies to Django
- PostgreSQL not exposed to host (internal only)
- Nginx serves on ports 80/443

## Volumes

### Named Volumes

- `postgres_data`: Persistent database storage
- `staticfiles`: Django static files
- `media`: User-uploaded media files

### Bind Mounts (Development Only)

- `./:/app`: Source code for live reloading

## Security Considerations

### Production

- Non-root user in containers
- Minimal base images
- Environment variables for secrets
- SSL/TLS encryption
- Security headers in Nginx
- Database not exposed externally

### Development

- Debug mode enabled
- Permissive CORS
- Database accessible for debugging

## Troubleshooting

### Common Issues

1. **Port conflicts:**

   - Development: Ensure port 5433 is available
   - Production: Ensure ports 80/443 are available

2. **Database connection issues:**

   - Check DATABASE_URL format
   - Ensure PostgreSQL container is healthy
   - Run migrations after container startup

3. **Static files not loading:**

   - Run `collectstatic` command
   - Check volume permissions
   - Verify Nginx configuration

4. **Permission issues:**
   - Ensure proper user permissions in containers
   - Check volume ownership

### Logs

```bash
# Django logs
docker-compose -f docker-compose.dev.yml logs django
docker-compose -f docker-compose.prod.yml logs django

# PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres
docker-compose -f docker-compose.prod.yml logs postgres

# Nginx logs (production only)
docker-compose -f docker-compose.prod.yml logs nginx
```

## Deployment

### CI/CD Integration

For automated deployment, you can:

1. Build images in CI pipeline
2. Push to container registry
3. Deploy using docker-compose or Kubernetes
4. Use environment-specific compose files

### Backup Strategy

```bash
# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U todoapi_prod_user todoapi_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Volume backup
docker run --rm -v todoapi_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## Performance Tuning

### Django

- Gunicorn workers: Adjust based on CPU cores
- Database connection pooling
- Caching with Redis (configured in production)

### PostgreSQL

- Connection limits
- Memory settings
- Backup strategy

### Nginx

- Worker processes
- Buffer sizes
- Cache settings

## Monitoring

Consider adding monitoring for:

- Application performance
- Database metrics
- Container resource usage
- Error rates and logs

## Support

For issues or questions:

1. Check the logs using the commands above
2. Verify environment variables
3. Ensure all prerequisites are installed
4. Check Docker and Docker Compose versions
