# 📋 Requerimientos del Proyecto - Todo VibeCoding

## 🎯 Descripción General

Este documento define los requerimientos técnicos y funcionales para la implementación de una aplicación de gestión de tareas (Todo App) siguiendo la filosofía **Vibe Coding**. La aplicación debe integrar un frontend React moderno con una API Django REST Framework.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico Principal

#### Frontend

- **React** 19.1.0+ con TypeScript
- **Vite** 7.0.4+ como bundler
- **Tailwind CSS** v4.1.11 para estilos
- **React Router** 7.8.0+ para navegación
- **Lucide React** para iconografía

#### Nuevas Dependencias Requeridas

- **Axios** para cliente HTTP
- **Redux Toolkit** para gestión de estado global
- **Shadcn/ui** para componentes de UI
- **React Hook Form** + **Zod** para formularios y validación
- **Framer Motion** para animaciones _(Baja prioridad)_

#### Testing

- **Jest** 30.0.5+ como framework de testing
- **React Testing Library** 16.3.0+ para testing de componentes
- **@testing-library/jest-dom** para matchers adicionales

## 📁 Estructura de Directorios Requerida

```
src/
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes base (shadcn/ui)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Dialog/
│   │   ├── Form/
│   │   └── index.ts
│   └── feature/             # Componentes específicos de funcionalidad
│       ├── TodoItem/
│       ├── TodoList/
│       ├── TodoForm/
│       ├── AuthForm/
│       └── Dashboard/
├── hooks/                   # Custom hooks
│   ├── useTodo.ts
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── index.ts
├── stores/                  # Redux Toolkit slices
│   ├── authSlice.ts
│   ├── todoSlice.ts
│   ├── uiSlice.ts
│   ├── store.ts
│   └── index.ts
├── services/                # API calls y lógica de negocio
│   ├── api.ts              # Cliente HTTP configurado
│   ├── authService.ts      # Servicios de autenticación
│   ├── taskService.ts      # Servicios de tareas
│   └── index.ts
├── types/                   # TypeScript types
│   ├── auth.ts
│   ├── todo.ts
│   ├── api.ts
│   ├── filter.ts
│   └── index.ts
├── utils/                   # Funciones utilitarias
│   ├── dateUtils.ts
│   ├── validationSchemas.ts # Esquemas Zod
│   ├── constants.ts
│   └── index.ts
├── pages/                   # Páginas de la aplicación
│   ├── HomePage/
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── CreateTodoPage/
│   ├── DashboardPage/
│   └── index.ts
├── routes/                  # Configuración de rutas
│   ├── AppRouter.tsx
│   ├── ProtectedRoute.tsx
│   ├── ErrorPage.tsx
│   └── index.ts
└── __tests__/               # Tests organizados
    ├── components/
    ├── hooks/
    ├── services/
    ├── utils/
    └── setup.ts
```

## 🔐 Requerimientos de Autenticación

### Endpoints de API Requeridos

| Método | Endpoint               | Descripción         | Implementación |
| ------ | ---------------------- | ------------------- | -------------- |
| POST   | `/auth/register/`      | Registro de usuario | ✅ Requerida   |
| POST   | `/auth/login/`         | Inicio de sesión    | ✅ Requerida   |
| POST   | `/auth/token/refresh/` | Renovar token       | ✅ Requerida   |

### Funcionalidades de Autenticación

1. **Registro de Usuario**

   - Formulario con validación usando React Hook Form + Zod
   - Campos: username, email, password, confirmPassword
   - Validación en tiempo real
   - Manejo de errores del servidor

2. **Inicio de Sesión**

   - Formulario con validación
   - Campos: username/email, password
   - Recordar sesión (opcional)
   - Redirección automática después del login

3. **Gestión de Tokens**

   - Almacenamiento seguro de tokens JWT
   - Renovación automática de tokens
   - Interceptores de Axios para manejo automático
   - Logout automático en caso de token expirado

4. **Rutas Protegidas**
   - Componente ProtectedRoute
   - Redirección a login si no está autenticado
   - Persistencia de la ruta intentada

## 📝 Requerimientos de Gestión de Tareas

### Endpoints de API Requeridos

| Método | Endpoint                      | Descripción               | Implementación |
| ------ | ----------------------------- | ------------------------- | -------------- |
| GET    | `/tasks/`                     | Listar tareas del usuario | ✅ Requerida   |
| POST   | `/tasks/`                     | Crear nueva tarea         | ✅ Requerida   |
| GET    | `/tasks/{id}/`                | Obtener tarea específica  | ✅ Requerida   |
| PUT    | `/tasks/{id}/`                | Actualizar tarea completa | ✅ Requerida   |
| PATCH  | `/tasks/{id}/`                | Actualizar tarea parcial  | ✅ Requerida   |
| DELETE | `/tasks/{id}/`                | Eliminar tarea            | ✅ Requerida   |
| PATCH  | `/tasks/{id}/mark_completed/` | Marcar como completada    | ✅ Requerida   |
| PATCH  | `/tasks/{id}/change_status/`  | Cambiar estado            | ✅ Requerida   |
| GET    | `/tasks/by_status/`           | Filtrar por estado        | ✅ Requerida   |
| GET    | `/tasks/completed_today/`     | Tareas completadas hoy    | ✅ Requerida   |
| GET    | `/tasks/stats/`               | Estadísticas de tareas    | ✅ Requerida   |

### Modelo de Datos - Tarea

```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pendiente" | "en_progreso" | "completada";
  status_display: string;
  user: string; // Username del propietario
  is_completed: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  completed_at?: string; // ISO datetime
  priority?: "baja" | "media" | "alta"; // Opcional
  due_date?: string; // Opcional
  tags?: string[]; // Opcional
}
```

### Funcionalidades de Tareas

1. **Listado de Tareas**

   - Vista de lista con paginación
   - Filtros por estado, prioridad, fecha
   - Búsqueda por título/descripción
   - Ordenamiento por fecha, prioridad, estado

2. **Creación de Tareas**

   - Formulario modal o página dedicada
   - Validación con Zod
   - Campos: título, descripción, estado inicial, prioridad, fecha límite
   - Feedback visual de éxito/error

3. **Edición de Tareas**

   - Edición inline o modal
   - Actualización optimista en UI
   - Rollback en caso de error

4. **Gestión de Estados**

   - Cambio de estado con drag & drop (opcional)
   - Botones de acción rápida
   - Animaciones de transición

5. **Dashboard y Estadísticas** _(Baja prioridad)_
   - Resumen de tareas por estado
   - Gráficos de productividad
   - Tareas completadas hoy
   - Métricas de rendimiento

## 🎨 Requerimientos de UI/UX

### Componentes Shadcn/ui Requeridos

1. **Componentes Base**

   - Button (variants: default, destructive, outline, secondary, ghost)
   - Input (text, password, email, search)
   - Textarea
   - Select
   - Checkbox
   - Radio Group
   - Switch

2. **Componentes de Layout**

   - Card (header, content, footer)
   - Dialog/Modal
   - Sheet (sidebar)
   - Tabs
   - Accordion

3. **Componentes de Feedback**

   - Alert
   - Toast/Sonner
   - Progress
   - Skeleton
   - Badge

4. **Componentes de Navegación**
   - Navigation Menu
   - Breadcrumb
   - Pagination

### Diseño Responsivo

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid y Flexbox con Tailwind
- **Touch Friendly**: Botones y áreas de toque adecuadas

### Tema y Colores

- **Modo Oscuro/Claro**: Toggle de tema
- **Paleta de Colores**: Definida en CSS variables
- **Accesibilidad**: Contraste WCAG AA
- **Consistencia**: Design tokens centralizados

## 🔄 Requerimientos de Estado Global (Redux Toolkit)

### Slices Requeridos

1. **authSlice**

   ```typescript
   interface AuthState {
     user: User | null;
     token: string | null;
     refreshToken: string | null;
     isAuthenticated: boolean;
     isLoading: boolean;
     error: string | null;
   }
   ```

2. **todoSlice**

   ```typescript
   interface TodoState {
     tasks: Task[];
     filteredTasks: Task[];
     currentFilter: FilterType;
     isLoading: boolean;
     error: string | null;
     stats: TaskStats | null;
   }
   ```

3. **uiSlice**
   ```typescript
   interface UIState {
     theme: "light" | "dark";
     sidebarOpen: boolean;
     currentModal: string | null;
     notifications: Notification[];
   }
   ```

### Middleware Requerido

- **RTK Query**: Para cache y sincronización de datos
- **Redux Persist**: Para persistencia del estado
- **Redux DevTools**: Para debugging en desarrollo

## 🧪 Requerimientos de Testing

### Cobertura de Testing

- **Componentes**: 90%+ de cobertura
- **Hooks**: 100% de cobertura
- **Services**: 95%+ de cobertura _(Baja prioridad)_
- **Utils**: 100% de cobertura

### Tipos de Tests

1. **Unit Tests**

   - Componentes individuales
   - Custom hooks
   - Funciones utilitarias
   - Redux slices

2. **Integration Tests**

   - Flujos de autenticación
   - CRUD de tareas
   - Navegación entre páginas

3. **E2E Tests** (Opcional)
   - Flujos críticos de usuario
   - Cypress o Playwright

### Configuración de Testing

- **Jest**: Configurado con TypeScript
- **Testing Library**: Para testing de componentes React
- **MSW**: Para mocking de API calls
- **Coverage Reports**: HTML y LCOV

## 🚀 Requerimientos de Performance

### Optimizaciones Requeridas

1. **Code Splitting**

   - Lazy loading de páginas
   - Dynamic imports para componentes pesados
   - Bundle analysis

2. **Caching**

   - RTK Query para cache de API
   - Service Worker (opcional)
   - Browser caching headers

3. **Optimización de Imágenes**

   - Formatos modernos (WebP, AVIF)
   - Lazy loading
   - Responsive images

4. **Métricas de Performance**
   - Core Web Vitals
   - Bundle size < 500KB
   - First Contentful Paint < 2s

## 🔒 Requerimientos de Seguridad

### Implementaciones de Seguridad

1. **Autenticación**

   - JWT tokens con expiración
   - Refresh token rotation
   - Logout en múltiples tabs

2. **Validación**

   - Validación client-side con Zod
   - Sanitización de inputs
   - XSS protection

3. **API Security**
   - HTTPS only
   - CORS configurado
   - Rate limiting awareness

## 📱 Requerimientos de Accesibilidad

### Estándares WCAG 2.1 AA

1. **Navegación**

   - Keyboard navigation
   - Focus management
   - Skip links

2. **Screen Readers**

   - ARIA labels
   - Semantic HTML
   - Alt texts

3. **Visual**
   - Contraste de colores
   - Tamaños de fuente escalables
   - Indicadores de focus

## 🌐 Requerimientos de Internacionalización (Opcional)

- **i18n**: React-i18next
- **Idiomas**: Español (default), Inglés
- **Formatos**: Fechas, números, monedas
- **RTL Support**: Preparado para idiomas RTL

## 📦 Requerimientos de Deployment

### Build y Deploy

1. **Build Process**

   - TypeScript compilation
   - Asset optimization
   - Environment variables

2. **CI/CD**

   - GitHub Actions (opcional)
   - Automated testing
   - Deploy previews

3. **Hosting**
   - Static hosting (Vercel, Netlify)
   - CDN distribution
   - Environment management

## 📋 Checklist de Implementación

### Fase 1: Configuración Base

- [ ] Instalar dependencias (axios, redux toolkit, shadcn)
- [ ] Configurar estructura de directorios
- [ ] Setup de Redux store
- [ ] Configuración de Tailwind + Shadcn
- [ ] Setup de testing environment

### Fase 2: Autenticación

- [ ] Implementar authSlice
- [ ] Crear authService con axios
- [ ] Componentes de login/register
- [ ] ProtectedRoute component
- [ ] Token management

### Fase 3: Gestión de Tareas

- [ ] Implementar todoSlice
- [ ] Crear taskService
- [ ] Componentes de CRUD de tareas
- [ ] Filtros y búsqueda
- [ ] Dashboard y estadísticas

### Fase 4: UI/UX

- [ ] Implementar tema oscuro/claro
- [ ] Responsive design
- [ ] Componentes Shadcn customizados
- [ ] Accesibilidad

### Fase 5: Testing y Optimización

- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Performance optimization
- [ ] Bundle analysis
- [ ] Security audit

### Fase 7: Funcionalidades de Baja Prioridad _(Opcional - Revisar al final)_

- [ ] Animaciones con Framer Motion
- [ ] Dashboard y estadísticas avanzadas
- [ ] Testing completo de services (95%+ cobertura)

### Fase 6: Deploy

- [ ] Build configuration
- [ ] Environment setup
- [ ] CI/CD pipeline
- [ ] Production deployment

---

**Desarrollado siguiendo la filosofía Vibe Coding - Código eficiente, mantenible y con estándares profesionales** 🚀
