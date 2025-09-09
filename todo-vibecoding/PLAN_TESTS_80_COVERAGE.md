# 📊 Plan de Tests para Alcanzar 80% de Cobertura

## 🎯 Objetivo

Actualmente el proyecto tiene **28.66%** de cobertura. Necesitamos implementar tests estratégicos para alcanzar **80%** de cobertura.

## 📈 Estado Actual de Cobertura

### ✅ Archivos con Buena Cobertura (>70%)

- `src/components/feature/TodoItem` - **100%** ✨
- `src/components/ui/StatsCard` - **100%** ✨
- `src/pages/HomePage` - **80%** ✅
- `src/components/feature/StatsSection` - **72.72%** ✅

### ⚠️ Archivos con Cobertura Media (40-70%)

- `src/components/feature/TodoList` - **68.75%**
- `src/pages/CreateTodoPage` - **60%**
- `src/stores/slices` - **59.91%**
- `src/components` (general) - **57.77%**
- `src/components/ui/Header` - **57.14%**

### 🔴 Archivos Sin Cobertura (0%)

- Todos los componentes feature sin tests
- Todas las páginas excepto HomePage y CreateTodoPage
- Todos los hooks personalizados
- Servicios (parcialmente testeados)
- Utils y schemas

---

## 🎯 CHECKLIST DE TESTS PRIORITARIOS

### 🏆 PRIORIDAD ALTA (Impacto Máximo en Cobertura)

#### 📱 Componentes Feature (0% → 80%)

- [x] **Filter Component** - `src/components/feature/Filter/Filter.test.tsx`

  - Renderizado de opciones de filtro
  - Cambio de filtros activos
  - Callbacks de onChange
  - Estados de filtro (all, completed, pending)

- [x] **FilterButtons Component** - `src/components/feature/FilterButtons/FilterButtons.test.tsx`

  - Renderizado de botones de filtro
  - Estados activo/inactivo
  - Clicks y navegación
  - Accesibilidad de botones

- [x] **Layout Component** - `src/components/feature/Layout/Layout.test.tsx`

  - Renderizado de estructura principal
  - Responsive design
  - Integración con children
  - Header y footer rendering

- [x] **Footer Component** - `src/components/feature/Layout/Footer.test.tsx`

  - Renderizado de información del footer
  - Links y navegación
  - Copyright y versión

- [x] **NotificationSystem Component** - `src/components/feature/Layout/NotificationSystem.test.tsx`

  - Renderizado de notificaciones
  - Tipos de notificación (success, error, info)
  - Auto-dismiss functionality
  - Queue de notificaciones

- [ ] **LoginForm Component** - `src/components/feature/LoginForm/LoginForm.test.tsx`

  - Renderizado de campos de login
  - Validación de formulario
  - Submit y manejo de errores
  - Estados de loading
  - Integración con useAuth

- [ ] **Navigation Component** - `src/components/feature/Navigation/Navigation.test.tsx`

  - Renderizado de menú de navegación
  - Links activos y navegación
  - Responsive menu (mobile/desktop)
  - Logout functionality

- [ ] **RegisterForm Component** - `src/components/feature/RegisterForm/RegisterForm.test.tsx`

  - Renderizado de campos de registro
  - Validación compleja de formulario
  - Confirmación de contraseña
  - Submit y manejo de errores
  - Estados de loading

- [ ] **StatsChart Component** - `src/components/feature/StatsChart/StatsChart.test.tsx`

  - Renderizado de gráfico de estadísticas
  - Datos de entrada y visualización
  - Responsive chart behavior
  - Tooltips y interactividad

- [ ] **TaskForm Component (Feature)** - `src/components/feature/TaskForm/TaskForm.test.tsx`
  - Renderizado de formulario de tareas
  - Validación de campos
  - Submit y creación de tareas
  - Estados de loading y error
  - Integración con store

#### 🎨 Componentes UI Base (0% → 80%)

- [ ] **Sidebar Component** - `src/components/ui/Sidebar/Sidebar.test.tsx`

  - Renderizado responsive (desktop/mobile)
  - FAB button functionality
  - Collapsible behavior
  - Filter integration

- [ ] **Button Component** - `src/components/ui/button.test.tsx`

  - Variantes de botón (primary, secondary, etc.)
  - Estados (disabled, loading)
  - Sizes y props
  - Click handlers
  - Accesibilidad

- [ ] **Input Component** - `src/components/ui/input.test.tsx`

  - Renderizado básico
  - Tipos de input (text, password, email)
  - Estados (disabled, error)
  - Validation states
  - Focus y blur events

- [ ] **Card Component** - `src/components/ui/card.test.tsx`

  - Renderizado de estructura
  - Children rendering
  - Variantes de estilo
  - Responsive behavior

- [ ] **Checkbox Component** - `src/components/ui/checkbox.test.tsx`
  - Estados checked/unchecked
  - Disabled state
  - Change handlers
  - Accesibilidad (ARIA)

#### 📄 Páginas (0% → 80%)

- [ ] **LoginPage** - `src/pages/LoginPage/LoginPage.test.tsx`

  - Renderizado de página completa
  - Integración con LoginForm
  - Navegación y redirección
  - Estados de autenticación

- [ ] **RegisterPage** - `src/pages/RegisterPage/RegisterPage.test.tsx`

  - Renderizado de página completa
  - Integración con RegisterForm
  - Navegación post-registro
  - Manejo de errores

- [ ] **TodoPage** - `src/pages/TodoPage/TodoPage.test.tsx`
  - Renderizado de página principal
  - Integración con todos los componentes
  - Estados de loading
  - Filtros y estadísticas

### 🔧 PRIORIDAD MEDIA (Funcionalidad Core)

#### 🎣 Hooks Personalizados (0% → 80%)

- [ ] **useAuth Hook** - `src/hooks/useAuth.test.ts`

  - Login/logout functionality
  - Token management
  - User state management
  - Error handling
  - Loading states

- [ ] **useForm Hook** - `src/hooks/useForm.test.ts`

  - Form state management
  - Validation logic
  - Submit handling
  - Reset functionality
  - Error states

- [ ] **useTodo Hook** - `src/hooks/useTodo.test.ts`
  - CRUD operations
  - State management
  - Filter logic
  - Statistics calculation
  - Error handling

#### 🌐 Servicios (44% → 80%)

- [ ] **httpClient Service** - `src/services/httpClient.test.ts`
  - HTTP methods (GET, POST, PUT, DELETE)
  - Error handling
  - Token injection
  - Response parsing
  - Timeout handling

#### 🗂️ Stores y State Management (59% → 80%)

- [ ] **Store Configuration** - `src/stores/store.test.ts`

  - Store setup
  - Middleware configuration
  - Initial state
  - Persistence

- [ ] **Hooks Store** - `src/stores/hooks.test.ts`
  - useAppDispatch
  - useAppSelector
  - Type safety

### 🔧 PRIORIDAD BAJA (Utilidades y Configuración)

#### 🛠️ Utilidades (29% → 80%)

- [ ] **Date Utils** - `src/utils/dateUtils.test.ts`

  - Formateo de fechas
  - Cálculos de tiempo
  - Timezone handling
  - Validation

- [ ] **Password Utils** - `src/utils/passwordUtils.test.ts`

  - Password strength validation
  - Hashing utilities
  - Security checks

- [ ] **Notifications Utils** - `src/utils/notifications.test.ts`
  - Toast notifications
  - Message formatting
  - Queue management

#### 📋 Schemas y Validación (0% → 80%)

- [ ] **Validation Schemas** - `src/schemas/validationSchemas.test.ts`
  - Zod schema validation
  - Error messages
  - Type inference
  - Custom validators

#### ⚙️ Configuración (0% → 60%)

- [ ] **Environment Config** - `src/config/env.test.ts`

  - Environment variables
  - Configuration loading
  - Validation

- [ ] **Utils Library** - `src/lib/utils.test.ts`
  - cn function (className utility)
  - Helper functions
  - Type utilities

#### 🛣️ Routing (14% → 70%)

- [ ] **AppRouter** - `src/routes/AppRouter.test.tsx`

  - Route configuration
  - Navigation logic
  - Protected routes
  - Error boundaries

- [ ] **ProtectedRoute** - `src/routes/ProtectedRoute.test.tsx`
  - Authentication checks
  - Redirection logic
  - Loading states
  - Error handling

---

## 📊 Estimación de Impacto en Cobertura

### 🎯 Implementación por Fases

#### Fase 1: Componentes Feature (Semana 1-2)

**Impacto estimado: +25% cobertura**

- 10 componentes feature principales
- Funcionalidad core de la aplicación
- Mayor impacto en statements y functions

#### Fase 2: Componentes UI + Páginas (Semana 3)

**Impacto estimado: +20% cobertura**

- 6 componentes UI base
- 3 páginas principales
- Cobertura de interfaz de usuario

#### Fase 3: Hooks + Servicios (Semana 4)

**Impacto estimado: +15% cobertura**

- 3 hooks personalizados
- Servicios HTTP
- Lógica de negocio

#### Fase 4: Utils + Config (Semana 5)

**Impacto estimado: +10% cobertura**

- Utilidades y helpers
- Configuración y schemas
- Routing avanzado

### 🎯 Meta Final

**Cobertura Objetivo: 80%+**

- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

---

## 🚀 Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests específicos
npm test -- --testPathPattern="Filter"
```

## 📝 Notas Importantes

1. **Priorizar por impacto**: Comenzar con componentes que tienen más líneas de código
2. **Mantener calidad**: Cada test debe seguir el patrón AAA y buenas prácticas
3. **Cobertura real**: No solo buscar números, sino tests que aporten valor
4. **Integración**: Algunos tests de integración pueden cubrir múltiples archivos
5. **Mantenimiento**: Tests deben ser fáciles de mantener y entender

---

**Creado por**: Testing Specialist Agent  
**Fecha**: $(date)  
**Objetivo**: Alcanzar 80% de cobertura de tests  
**Estado**: 📋 Plan Inicial - Listo para implementación
