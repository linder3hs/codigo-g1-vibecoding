import { TextEncoder } from "text-encoding";

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;

// Mock import.meta.env for Vite environment variables
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: "http://localhost:8000/api",
        VITE_API_VERSION: "v1",
        VITE_APP_NAME: "Todo VibeCoding",
        VITE_APP_VERSION: "1.0.0",
        DEV: true,
        PROD: false,
        MODE: "test"
      }
    }
  },
  writable: true,
  configurable: true
});

// Types for Request mock
interface MockRequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string | null;
}

interface MockResponseInit {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}

// Mock Request for React Router
class MockRequest {
  public readonly method: string;
  public readonly url: string;
  public readonly headers: Record<string, string>;
  public readonly body: string | null;
  
  constructor(url: string, init?: MockRequestInit) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.headers = init?.headers || {};
    this.body = init?.body || null;
  }
  
  clone(): MockRequest {
    return new MockRequest(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body
    });
  }
}

// Mock Response for React Router
class MockResponse {
  public readonly body: unknown;
  public readonly status: number;
  public readonly statusText: string;
  public readonly headers: Record<string, string>;
  
  constructor(body?: unknown, init?: MockResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = init?.headers || {};
  }
  
  clone(): MockResponse {
    return new MockResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  }
}

// Type-safe assignment to global using module augmentation approach
interface GlobalWithMocks {
  Request: typeof MockRequest;
  Response: typeof MockResponse;
}

// Assign mocks to global with proper typing
(globalThis as unknown as GlobalWithMocks).Request = MockRequest;
(globalThis as unknown as GlobalWithMocks).Response = MockResponse;

// Mock fetch if not available
