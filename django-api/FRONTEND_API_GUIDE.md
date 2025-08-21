# 📚 Guía de API para Frontend React + Vite

## 🎯 Introducción

Esta guía te ayudará a integrar tu aplicación React con Vite con la API de tareas Django REST Framework. Incluye ejemplos completos de código, manejo de autenticación y mejores prácticas.

## 🏗️ Configuración Inicial

### 1. Instalación de Dependencias

```bash
npm install axios
# O si prefieres fetch nativo, no necesitas instalar nada adicional
```

### 2. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz de tu proyecto React:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_VERSION=api
```

### 3. Configuración del Cliente HTTP

Crea `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/${API_VERSION}/auth/token/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token expirado, redirigir al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 🔐 Autenticación

### Endpoints de Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register/` | Registro de usuario |
| POST | `/auth/login/` | Inicio de sesión |
| POST | `/auth/token/refresh/` | Renovar token |
| POST | `/auth/logout/` | Cerrar sesión |

### Servicio de Autenticación

Crea `src/services/authService.js`:

```javascript
import apiClient from './api';

class AuthService {
  // Registro de usuario
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register/', userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al registrar usuario'
      };
    }
  }

  // Inicio de sesión
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login/', credentials);
      const { access, refresh, user } = response.data;
      
      // Guardar tokens en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        data: response.data,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al iniciar sesión'
      };
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post('/auth/logout/', {
          refresh: refreshToken
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage independientemente del resultado
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
```

### Ejemplo de Componente de Login

```jsx
import React, { useState } from 'react';
import authService from '../services/authService';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.login(formData);
    
    if (result.success) {
      onLoginSuccess(result.data.user);
    } else {
      setError(result.error.detail || 'Error al iniciar sesión');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default LoginForm;
```

## 📝 API de Tareas

### Endpoints Disponibles

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/tasks/` | Listar tareas del usuario | ✅ Requerida |
| POST | `/tasks/` | Crear nueva tarea | ✅ Requerida |
| GET | `/tasks/{id}/` | Obtener tarea específica | ✅ Requerida |
| PUT | `/tasks/{id}/` | Actualizar tarea completa | ✅ Requerida |
| PATCH | `/tasks/{id}/` | Actualizar tarea parcial | ✅ Requerida |
| DELETE | `/tasks/{id}/` | Eliminar tarea | ✅ Requerida |
| PATCH | `/tasks/{id}/mark_completed/` | Marcar como completada | ✅ Requerida |
| PATCH | `/tasks/{id}/change_status/` | Cambiar estado | ✅ Requerida |
| GET | `/tasks/by_status/` | Filtrar por estado | ✅ Requerida |
| GET | `/tasks/completed_today/` | Tareas completadas hoy | ✅ Requerida |
| GET | `/tasks/stats/` | Estadísticas de tareas | ✅ Requerida |

### Servicio de Tareas

Crea `src/services/taskService.js`:

```javascript
import apiClient from './api';

class TaskService {
  // Obtener todas las tareas del usuario
  async getTasks() {
    try {
      const response = await apiClient.get('/tasks/');
      return {
        success: true,
        data: response.data,
        message: 'Tareas obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al obtener tareas'
      };
    }
  }

  // Crear nueva tarea
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/tasks/', taskData);
      return {
        success: true,
        data: response.data,
        message: 'Tarea creada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al crear tarea'
      };
    }
  }

  // Obtener tarea específica
  async getTask(taskId) {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/`);
      return {
        success: true,
        data: response.data,
        message: 'Tarea obtenida exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al obtener tarea'
      };
    }
  }

  // Actualizar tarea
  async updateTask(taskId, taskData) {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/`, taskData);
      return {
        success: true,
        data: response.data,
        message: 'Tarea actualizada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al actualizar tarea'
      };
    }
  }

  // Eliminar tarea
  async deleteTask(taskId) {
    try {
      await apiClient.delete(`/tasks/${taskId}/`);
      return {
        success: true,
        message: 'Tarea eliminada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al eliminar tarea'
      };
    }
  }

  // Marcar tarea como completada
  async markCompleted(taskId) {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/mark_completed/`);
      return {
        success: true,
        data: response.data,
        message: 'Tarea marcada como completada'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al marcar tarea como completada'
      };
    }
  }

  // Cambiar estado de tarea
  async changeStatus(taskId, status) {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/change_status/`, {
        status: status
      });
      return {
        success: true,
        data: response.data,
        message: 'Estado de tarea actualizado'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al cambiar estado de tarea'
      };
    }
  }

  // Filtrar tareas por estado
  async getTasksByStatus(status) {
    try {
      const response = await apiClient.get(`/tasks/by_status/?status=${status}`);
      return {
        success: true,
        data: response.data,
        message: 'Tareas filtradas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al filtrar tareas'
      };
    }
  }

  // Obtener tareas completadas hoy
  async getCompletedToday() {
    try {
      const response = await apiClient.get('/tasks/completed_today/');
      return {
        success: true,
        data: response.data,
        message: 'Tareas completadas hoy obtenidas'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al obtener tareas completadas hoy'
      };
    }
  }

  // Obtener estadísticas
  async getStats() {
    try {
      const response = await apiClient.get('/tasks/stats/');
      return {
        success: true,
        data: response.data,
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Error de conexión' },
        message: 'Error al obtener estadísticas'
      };
    }
  }
}

export default new TaskService();
```

## 📊 Modelos de Datos

### Estructura de Tarea

```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pendiente' | 'en_progreso' | 'completada';
  status_display: string;
  user: string; // Username del propietario
  is_completed: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  completed_at?: string; // ISO datetime
}
```

### Estados Válidos

```javascript
const TASK_STATUSES = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en_progreso',
  COMPLETED: 'completada'
};

const TASK_STATUS_LABELS = {
  [TASK_STATUSES.PENDING]: 'Pendiente',
  [TASK_STATUSES.IN_PROGRESS]: 'En Progreso',
  [TASK_STATUSES.COMPLETED]: 'Completada'
};
```

## 🎨 Ejemplos de Componentes React

### Lista de Tareas

```jsx
import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const result = await taskService.getTasks();
    
    if (result.success) {
      setTasks(result.data);
      setError('');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const result = await taskService.changeStatus(taskId, newStatus);
    
    if (result.success) {
      // Actualizar la tarea en el estado local
      setTasks(tasks.map(task => 
        task.id === taskId ? result.data : task
      ));
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      const result = await taskService.deleteTask(taskId);
      
      if (result.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        alert(result.message);
      }
    }
  };

  if (loading) return <div>Cargando tareas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="task-list">
      <h2>Mis Tareas</h2>
      
      {tasks.length === 0 ? (
        <p>No tienes tareas creadas.</p>
      ) : (
        <div className="tasks">
          {tasks.map(task => (
            <div key={task.id} className={`task-item status-${task.status}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="task-meta">
                  <span className="status">{task.status_display}</span>
                  <span className="date">
                    Creada: {new Date(task.created_at).toLocaleDateString()}
                  </span>
                  {task.completed_at && (
                    <span className="completed-date">
                      Completada: {new Date(task.completed_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="task-actions">
                <select 
                  value={task.status} 
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
                
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
```

### Formulario de Creación de Tareas

```jsx
import React, { useState } from 'react';
import taskService from '../services/taskService';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pendiente'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await taskService.createTask(formData);
    
    if (result.success) {
      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        status: 'pendiente'
      });
      
      // Notificar al componente padre
      if (onTaskCreated) {
        onTaskCreated(result.data);
      }
      
      alert('Tarea creada exitosamente');
    } else {
      // Mostrar errores de validación
      if (result.error && typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        alert(result.message);
      }
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Crear Nueva Tarea</h2>
      
      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          required
        />
        {errors.title && (
          <span className="error-text">{errors.title[0]}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && (
          <span className="error-text">{errors.description[0]}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="status">Estado Inicial</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={errors.status ? 'error' : ''}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>
        {errors.status && (
          <span className="error-text">{errors.status[0]}</span>
        )}
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;
```

### Dashboard con Estadísticas

```jsx
import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [completedToday, setCompletedToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    const [statsResult, completedTodayResult] = await Promise.all([
      taskService.getStats(),
      taskService.getCompletedToday()
    ]);
    
    if (statsResult.success) {
      setStats(statsResult.data);
    }
    
    if (completedTodayResult.success) {
      setCompletedToday(completedTodayResult.data);
    }
    
    setLoading(false);
  };

  if (loading) return <div>Cargando dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard de Tareas</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total de Tareas</h3>
            <div className="stat-number">{stats.total}</div>
          </div>
          
          <div className="stat-card">
            <h3>Pendientes</h3>
            <div className="stat-number pending">{stats.pendiente}</div>
          </div>
          
          <div className="stat-card">
            <h3>En Progreso</h3>
            <div className="stat-number in-progress">{stats.en_progreso}</div>
          </div>
          
          <div className="stat-card">
            <h3>Completadas</h3>
            <div className="stat-number completed">{stats.completada}</div>
          </div>
          
          <div className="stat-card">
            <h3>Tasa de Completado</h3>
            <div className="stat-number">{stats.completion_rate}%</div>
          </div>
          
          <div className="stat-card">
            <h3>Completadas Hoy</h3>
            <div className="stat-number">{stats.completed_today}</div>
          </div>
        </div>
      )}
      
      {completedToday && completedToday.tasks.length > 0 && (
        <div className="completed-today">
          <h2>Tareas Completadas Hoy ({completedToday.count})</h2>
          <div className="task-list">
            {completedToday.tasks.map(task => (
              <div key={task.id} className="task-item completed">
                <h4>{task.title}</h4>
                <span className="completed-time">
                  Completada a las {new Date(task.completed_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```

## 🛡️ Reglas y Permisos

### Autenticación Requerida

- **Todos los endpoints de tareas requieren autenticación**
- El token JWT debe incluirse en el header `Authorization: Bearer <token>`
- Los tokens expiran y se renuevan automáticamente con el interceptor

### Permisos de Tareas

1. **Propiedad**: Los usuarios solo pueden ver y modificar sus propias tareas
2. **Creación**: Cualquier usuario autenticado puede crear tareas
3. **Lectura**: Solo las tareas del usuario autenticado
4. **Actualización**: Solo el propietario puede actualizar sus tareas
5. **Eliminación**: Solo el propietario puede eliminar sus tareas

### Validaciones del Frontend

```javascript
// Validaciones recomendadas antes de enviar al backend
const validateTask = (taskData) => {
  const errors = {};
  
  // Título requerido
  if (!taskData.title || taskData.title.trim().length === 0) {
    errors.title = 'El título es requerido';
  } else if (taskData.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres';
  } else if (taskData.title.length > 200) {
    errors.title = 'El título no puede exceder 200 caracteres';
  }
  
  // Estado válido
  const validStatuses = ['pendiente', 'en_progreso', 'completada'];
  if (taskData.status && !validStatuses.includes(taskData.status)) {
    errors.status = 'Estado inválido';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

## 🔧 Manejo de Errores

### Tipos de Errores Comunes

```javascript
// Errores de autenticación
if (error.response?.status === 401) {
  // Token expirado o inválido
  // Redirigir al login
}

// Errores de validación
if (error.response?.status === 400) {
  // Mostrar errores de validación al usuario
  const validationErrors = error.response.data;
}

// Errores de permisos
if (error.response?.status === 403) {
  // Usuario no tiene permisos
  alert('No tienes permisos para realizar esta acción');
}

// Recurso no encontrado
if (error.response?.status === 404) {
  // Tarea no existe o no pertenece al usuario
  alert('Tarea no encontrada');
}

// Error del servidor
if (error.response?.status >= 500) {
  // Error interno del servidor
  alert('Error del servidor. Intenta más tarde.');
}
```

## 🚀 Optimizaciones Recomendadas

### 1. Context para Estado Global

```jsx
// src/contexts/TaskContext.js
import React, { createContext, useContext, useReducer } from 'react';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    loading: false,
    error: null
  });

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask debe usarse dentro de TaskProvider');
  }
  return context;
};
```

### 2. Hook Personalizado para Tareas

```jsx
// src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    
    const result = await taskService.getTasks();
    
    if (result.success) {
      setTasks(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const createTask = async (taskData) => {
    const result = await taskService.createTask(taskData);
    
    if (result.success) {
      setTasks(prev => [...prev, result.data]);
    }
    
    return result;
  };

  const updateTask = async (taskId, taskData) => {
    const result = await taskService.updateTask(taskId, taskData);
    
    if (result.success) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? result.data : task
      ));
    }
    
    return result;
  };

  const deleteTask = async (taskId) => {
    const result = await taskService.deleteTask(taskId);
    
    if (result.success) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
    
    return result;
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask
  };
};
```

### 3. Componente de Protección de Rutas

```jsx
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
```

## 📱 Ejemplo de Aplicación Completa

```jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <TaskList />
              </ProtectedRoute>
            } />
            <Route path="/tasks/new" element={
              <ProtectedRoute>
                <TaskForm />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;
```

## 🎨 Estilos CSS Recomendados

```css
/* src/App.css */
.task-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.task-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-item.status-pendiente {
  border-left: 4px solid #ffc107;
}

.task-item.status-en_progreso {
  border-left: 4px solid #007bff;
}

.task-item.status-completada {
  border-left: 4px solid #28a745;
  background-color: #f8f9fa;
}

.task-content h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.task-meta {
  display: flex;
  gap: 16px;
  font-size: 0.9em;
  color: #666;
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 2em;
  font-weight: bold;
  margin-top: 10px;
}

.stat-number.pending { color: #ffc107; }
.stat-number.in-progress { color: #007bff; }
.stat-number.completed { color: #28a745; }

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 4px;
  display: block;
}
```

## 🔍 Testing

### Ejemplo de Test para Servicio

```javascript
// src/services/__tests__/taskService.test.js
import taskService from '../taskService';
import apiClient from '../api';

// Mock del cliente API
jest.mock('../api');

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task', status: 'pendiente' }
      ];
      
      apiClient.get.mockResolvedValue({ data: mockTasks });
      
      const result = await taskService.getTasks();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTasks);
      expect(apiClient.get).toHaveBeenCalledWith('/tasks/');
    });

    it('should handle errors', async () => {
      const mockError = {
        response: { data: { detail: 'Error message' } }
      };
      
      apiClient.get.mockRejectedValue(mockError);
      
      const result = await taskService.getTasks();
      
      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError.response.data);
    });
  });
});
```

## 📚 Recursos Adicionales

### Documentación de la API
- Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- ReDoc: `http://127.0.0.1:8000/api/schema/redoc/`
- Schema JSON: `http://127.0.0.1:8000/api/schema/`

### Herramientas Recomendadas
- **React Query**: Para manejo avanzado de estado del servidor
- **Formik**: Para manejo de formularios complejos
- **React Hook Form**: Alternativa ligera para formularios
- **Axios**: Cliente HTTP (ya incluido en esta guía)
- **React Router**: Para navegación (ya incluido en ejemplos)

### Próximos Pasos
1. Implementar paginación en la lista de tareas
2. Agregar filtros avanzados (por fecha, estado, etc.)
3. Implementar notificaciones en tiempo real
4. Agregar funcionalidad de búsqueda
5. Implementar modo offline con sincronización

---

**¡Feliz desarrollo! 🚀**

Esta guía te proporciona todo lo necesario para integrar tu frontend React con la API de tareas. Recuerda siempre manejar los errores apropiadamente y validar los datos tanto en el frontend como en el backend.