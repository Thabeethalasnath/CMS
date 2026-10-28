const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response: Response | undefined;
  let shouldFallback = false;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
    if (!response.ok && response.status >= 500 && typeof BASE_URL === 'string' && BASE_URL.includes('localhost:8080')) {
      shouldFallback = true;
    }
  } catch {
    shouldFallback = true;
  }

  if (shouldFallback && typeof BASE_URL === 'string' && BASE_URL.includes('localhost:8080')) {
    const fallbackUrl = `/api/v1${endpoint}`;
    try {
      const fallbackResp = await fetch(fallbackUrl, {
        ...options,
        headers,
      });
      if (fallbackResp.ok) {
        response = fallbackResp;
      }
    } catch {
      // Fallback failed, keep original response or rethrow
    }
  }

  if (!response) {
    throw new ApiError('Network connection failed', 503);
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      responseData?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, responseData);
  }

  return responseData as ApiResponse<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>) => {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        query = `?${queryString}`;
      }
    }
    return request<T>(`${endpoint}${query}`, { method: 'GET' });
  },

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
    }),
};
