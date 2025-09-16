# Guía de Implementación Docker para Todo VibeCoding

## Análisis del Proyecto

### Dependencias Principales

- **React**: 19.1.0 (última versión)
- **Vite**: 7.0.4 (build tool)
- **TypeScript**: 5.8.3
- **Node.js Local**: 22.x

### Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_VERSION=
VITE_APP_NAME=Todo VibeCoding
VITE_APP_VERSION=1.0.0
```

## Estrategia Docker Multi-Entorno

### 1. Dockerfile Base (Desarrollo)

```dockerfile
# Dockerfile.dev
FROM node:22-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de desarrollo
CMD ["npm", "run", "dev"]
```

### 2. Dockerfile Producción

```dockerfile
# Dockerfile.prod
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Imagen final con nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Dockerfile Testing

```dockerfile
# Dockerfile.test
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Ejecutar tests
CMD ["npm", "run", "test:ci"]
```

## Docker Compose por Entorno

### Desarrollo (docker-compose.dev.yml)

```yaml
version: "3.8"
services:
  todo-app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api
      - VITE_APP_NAME=Todo VibeCoding Dev
    env_file:
      - .env.local
```

### Producción (docker-compose.prod.yml)

```yaml
version: "3.8"
services:
  todo-app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=${API_BASE_URL}
      - VITE_APP_NAME=Todo VibeCoding
    restart: unless-stopped
```

## Gestión de Variables de Entorno

### Estructura de Archivos

```md
├── .env.example # Template
├── .env.local # Desarrollo local
├── .env.development # Docker desarrollo
├── .env.production # Docker producción
├── .env.test # Docker testing
```

### Configuración por Entorno

**Desarrollo:**

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Todo VibeCoding Dev
VITE_APP_VERSION=dev
```

**Producción:**

```env
VITE_API_BASE_URL=https://api.production.com/api
VITE_APP_NAME=Todo VibeCoding
VITE_APP_VERSION=1.0.0
```

## Comandos de Uso

### Desarrollo

```bash
# Construir y ejecutar
docker-compose -f docker-compose.dev.yml up --build

# Solo ejecutar
docker-compose -f docker-compose.dev.yml up
```

### Producción

```bash
# Construir imagen
docker build -f Dockerfile.prod -t todo-vibecoding:latest .

# Ejecutar con compose
docker-compose -f docker-compose.prod.yml up -d
```

### Testing

```bash
# Ejecutar tests
docker build -f Dockerfile.test -t todo-vibecoding:test .
docker run --rm todo-vibecoding:test
```

## Optimizaciones Recomendadas

1. **Multi-stage builds** para reducir tamaño de imagen final
2. **Node Alpine** para imágenes más ligeras
3. **Volume mounting** en desarrollo para hot reload
4. **Health checks** para monitoreo
5. **Build cache** con .dockerignore optimizado

## Consideraciones de Seguridad

- No incluir archivos `.env` en la imagen
- Usar secrets de Docker para datos sensibles
- Ejecutar como usuario no-root en producción
- Escanear imágenes por vulnerabilidades

## Orden de Implementación de Tareas

### Fase 1: Preparación y Configuración Base

1. **Crear archivo .dockerignore** - Optimizar el build cache excluyendo archivos innecesarios
2. **Crear archivos de variables de entorno por ambiente**
   - `.env.development` - Variables para desarrollo en Docker
   - `.env.production` - Variables para producción
   - `.env.test` - Variables para testing automatizado

### Fase 2: Dockerfiles por Entorno

3. **Crear Dockerfile.dev** - Contenedor para entorno de desarrollo con hot reload
4. **Crear Dockerfile.prod** - Contenedor optimizado para producción con multi-stage build
5. **Crear Dockerfile.test** - Contenedor para ejecutar tests automatizados
6. **Crear configuración nginx.conf** - Servidor web para el contenedor de producción

### Fase 3: Docker Compose

7. **Crear docker-compose.dev.yml** - Orquestación para desarrollo local
8. **Crear docker-compose.prod.yml** - Orquestación para producción

### Fase 4: Validación y Testing

9. **Probar configuración de desarrollo** - Validar que docker-compose.dev.yml funcione correctamente
10. **Probar configuración de producción** - Validar que la imagen de producción se construya y ejecute correctamente

## Workflow Recomendado

1. **Desarrollo**: `docker-compose.dev.yml` con hot reload
2. **Testing**: Pipeline CI/CD con `Dockerfile.test`
3. **Staging**: `docker-compose.prod.yml` con variables de staging
4. **Producción**: Imagen optimizada con `Dockerfile.prod`
