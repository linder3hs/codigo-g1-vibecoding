# 🧪 Estructura de Tests y Metodología

## 📁 Estructura de Carpetas para Tests

### 🎯 Patrón Co-localizado (Recomendado)

Cada componente tendrá su test en la misma carpeta:

```
src/components/ComponentName/
├── ComponentName.tsx      # Componente principal
├── ComponentName.test.tsx # Test co-localizado ✅
└── index.ts              # Exports
```

### 📂 Estructura Completa del Proyecto

```
src/
├── components/
│   ├── feature/
│   │   ├── Filter/
│   │   │   ├── Filter.tsx
│   │   │   ├── Filter.test.tsx ✅
│   │   │   └── index.ts
│   │   ├── Layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Layout.test.tsx ✅
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.test.tsx ✅
│   │   │   └── index.ts
│   │   ├── LoginForm/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.test.tsx ✅
│   │   │   └── index.ts
│   │   └── RegisterForm/
│   │       ├── RegisterForm.tsx
│   │       ├── RegisterForm.test.tsx ✅
│   │       └── index.ts
│   └── ui/
│       ├── button.tsx
│       ├── button.test.tsx ✅
│       ├── input.tsx
│       ├── input.test.tsx ✅
│       ├── card.tsx
│       ├── card.test.tsx ✅
│       └── checkbox.tsx
│           └── checkbox.test.tsx ✅
├── pages/
│   ├── LoginPage/
│   │   ├── LoginPage.tsx
│   │   ├── LoginPage.test.tsx ✅
│   │   └── index.ts
│   ├── RegisterPage/
│   │   ├── RegisterPage.tsx
│   │   ├── RegisterPage.test.tsx ✅
│   │   └── index.ts
│   └── TodoPage/
│       ├── TodoPage.tsx
│       ├── TodoPage.test.tsx ✅
│       └── index.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useAuth.test.ts ✅
│   ├── useForm.ts
│   ├── useForm.test.ts ✅
│   ├── useTodo.ts
│   └── useTodo.test.ts ✅
├── services/
│   ├── httpClient.ts
│   ├── httpClient.test.ts ✅
│   ├── authService.ts
│   └── authService.test.ts ✅ (ya existe)
├── utils/
│   ├── dateUtils.ts
│   ├── dateUtils.test.ts ✅
│   ├── passwordUtils.ts
│   ├── passwordUtils.test.ts ✅
│   ├── notifications.ts
│   └── notifications.test.ts ✅
└── schemas/
    ├── validationSchemas.ts
    └── validationSchemas.test.ts ✅
```

---

## 🧪 Template Obligatorio para Tests

### 📱 Para Componentes React (.test.tsx)

```typescript
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentName } from "./ComponentName";

// Mocks si son necesarios
jest.mock("../../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: 1, name: "Test User" },
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  }),
}));

describe("ComponentName", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render correctly with default props", () => {
      render(<ComponentName />);
      expect(screen.getByRole("...")).toBeInTheDocument();
    });

    it("should render with custom props", () => {
      render(<ComponentName variant="primary" size="large" />);
      expect(screen.getByRole("button")).toHaveClass(
        "btn-primary",
        "btn-large"
      );
    });
  });

  describe("User Interactions", () => {
    it("should handle click events", async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();

      render(<ComponentName onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should handle form submission", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();

      render(<ComponentName onSubmit={mockOnSubmit} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test input");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          value: "test input",
        });
      });
    });
  });

  describe("State Management", () => {
    it("should manage internal state correctly", async () => {
      const user = userEvent.setup();
      render(<ComponentName initialValue={0} />);

      const incrementButton = screen.getByRole("button", {
        name: /increment/i,
      });
      await user.click(incrementButton);

      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error messages", () => {
      render(<ComponentName error="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible", () => {
      render(<ComponentName />);
      const element = screen.getByRole("button");
      expect(element).toHaveAttribute("aria-label");
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<ComponentName />);

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard("{Enter}");
      // Assert expected behavior
    });
  });
});
```

### 🎣 Para Hooks (.test.ts)

```typescript
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCustomHook } from "./useCustomHook";

// Mocks
jest.mock("../services/apiService", () => ({
  fetchData: jest.fn(),
  postData: jest.fn(),
}));

describe("useCustomHook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should return initial state", () => {
      const { result } = renderHook(() => useCustomHook());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch data successfully", async () => {
      const mockData = { id: 1, name: "Test" };
      (apiService.fetchData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useCustomHook());

      act(() => {
        result.current.fetchData();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockData);
      });
    });

    it("should handle fetch errors", async () => {
      const mockError = new Error("Fetch failed");
      (apiService.fetchData as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useCustomHook());

      act(() => {
        result.current.fetchData();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(mockError.message);
      });
    });
  });
});
```

### 🌐 Para Servicios (.test.ts)

```typescript
import { httpClient } from "./httpClient";
import { authService } from "./authService";

// Mock fetch
global.fetch = jest.fn();

describe("httpClient", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe("GET requests", () => {
    it("should make GET request successfully", async () => {
      const mockResponse = { data: "test" };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await httpClient.get("/api/test");

      expect(fetch).toHaveBeenCalledWith("/api/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle GET request errors", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(httpClient.get("/api/test")).rejects.toThrow(
        "HTTP error! status: 404"
      );
    });
  });

  describe("POST requests", () => {
    it("should make POST request with data", async () => {
      const mockData = { name: "test" };
      const mockResponse = { id: 1, ...mockData };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await httpClient.post("/api/test", mockData);

      expect(fetch).toHaveBeenCalledWith("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockData),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
```

### 🛠️ Para Utilidades (.test.ts)

```typescript
import { formatDate, isValidDate, calculateDaysAgo } from "./dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date, "DD/MM/YYYY");
      expect(result).toBe("15/01/2024");
    });

    it("should handle invalid date", () => {
      const result = formatDate(null, "DD/MM/YYYY");
      expect(result).toBe("");
    });
  });

  describe("isValidDate", () => {
    it("should return true for valid date", () => {
      const date = new Date("2024-01-15");
      expect(isValidDate(date)).toBe(true);
    });

    it("should return false for invalid date", () => {
      const date = new Date("invalid");
      expect(isValidDate(date)).toBe(false);
    });
  });

  describe("calculateDaysAgo", () => {
    it("should calculate days correctly", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      const result = calculateDaysAgo(pastDate);
      expect(result).toBe(5);
    });
  });
});
```

---

## 🎯 Metodología de Testing

### 📋 Patrón AAA (Arrange, Act, Assert)

```typescript
it("should handle user login", async () => {
  // 🔧 ARRANGE - Preparar el escenario
  const user = userEvent.setup();
  const mockLogin = jest.fn();
  render(<LoginForm onLogin={mockLogin} />);

  // ⚡ ACT - Ejecutar la acción
  const emailInput = screen.getByRole("textbox", { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole("button", { name: /login/i });

  await user.type(emailInput, "test@example.com");
  await user.type(passwordInput, "password123");
  await user.click(submitButton);

  // ✅ ASSERT - Verificar el resultado
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
```

### 🎭 Estrategias de Testing

#### 1. **Componentes UI Base**

- ✅ Props y variantes
- ✅ Estados (disabled, loading, error)
- ✅ Eventos de usuario
- ✅ Accesibilidad (ARIA, keyboard)

#### 2. **Componentes Feature**

- ✅ Integración con hooks
- ✅ Manejo de estado complejo
- ✅ Flujos de usuario completos
- ✅ Error boundaries

#### 3. **Páginas**

- ✅ Renderizado completo
- ✅ Navegación y routing
- ✅ Integración de componentes
- ✅ Estados de carga

#### 4. **Hooks**

- ✅ Estado inicial
- ✅ Actualizaciones de estado
- ✅ Efectos secundarios
- ✅ Cleanup

#### 5. **Servicios**

- ✅ Métodos HTTP
- ✅ Manejo de errores
- ✅ Transformación de datos
- ✅ Autenticación

---

## 🚫 Anti-patrones a Evitar

```typescript
// ❌ MAL - Testing implementation details
expect(component.state().isOpen).toBe(true);

// ✅ BIEN - Testing behavior
expect(screen.getByText("Modal Content")).toBeInTheDocument();

// ❌ MAL - Selectors frágiles
screen.getByTestId("submit-btn-123");

// ✅ BIEN - Selectors semánticos
screen.getByRole("button", { name: /submit/i });

// ❌ MAL - Timeouts fijos
setTimeout(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
}, 1000);

// ✅ BIEN - waitFor async
await waitFor(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
});
```

---

## 📊 Métricas de Calidad

### 🎯 Objetivos de Cobertura

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

### ⚡ Performance

- **Tiempo por suite**: <5 segundos
- **Zero flaky tests**: Tests consistentes
- **Memory leaks**: Cleanup correcto

### 🔧 Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests específicos
npm test -- --testPathPattern="Filter"

# Tests con verbose output
npm test -- --verbose

# Tests con coverage threshold
npm test -- --coverage --coverageThreshold='{"global":{"statements":80}}'
```

---

## 🚀 Plan de Implementación

### Fase 1: Setup y Componentes Feature (Semana 1-2)

1. ✅ Configurar estructura de carpetas
2. ✅ Crear templates de testing
3. ✅ Implementar tests de componentes feature

### Fase 2: UI Components y Páginas (Semana 3)

1. ✅ Tests de componentes UI base
2. ✅ Tests de páginas principales
3. ✅ Integración y navegación

### Fase 3: Hooks y Servicios (Semana 4)

1. ✅ Tests de hooks personalizados
2. ✅ Tests de servicios HTTP
3. ✅ Tests de state management

### Fase 4: Utils y Configuración (Semana 5)

1. ✅ Tests de utilidades
2. ✅ Tests de schemas y validación
3. ✅ Tests de configuración

---

**Objetivo Final**: 🎯 **80%+ de cobertura** con tests de alta calidad que aporten valor real al proyecto.

**Principios**:

- 🧪 Tests que fallan primero (TDD)
- 🎭 Behavior over implementation
- 🚀 Fast, reliable, maintainable
- ♿ Accessibility-first testing
- 🔧 Real-world scenarios
