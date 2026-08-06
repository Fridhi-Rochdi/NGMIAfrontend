import { getAuthToken } from './auth-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Reads the tenant slug from the stored user object in localStorage
function getTenantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.tenant?.slug ?? null;
  } catch {
    return null;
  }
}

// Builds the common headers for every request
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const slug = getTenantSlug();
    if (slug) {
      headers['X-Tenant-Slug'] = slug;
    }
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP error! status: ${response.status}` };
    }
    const error: any = new Error(errorData.message || `HTTP error! status: ${response.status}`);
    error.response = { data: errorData, status: response.status };
    throw error;
  }
  
  const data = await response.json();
  // Unwrap response from TransformInterceptor if present
  const unwrappedData = data?.data !== undefined && typeof data === 'object' 
    ? data.data 
    : data;
  return {
    data: unwrappedData,
    status: response.status,
  };
}

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: buildHeaders(),
  });
  
  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  
  return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  
  return handleResponse<T>(response);
}

export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  
  return handleResponse<T>(response);
}

// File upload function
export async function upload<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const slug = getTenantSlug();
    if (slug) {
      headers['X-Tenant-Slug'] = slug;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse<T>(response);
}

// Convenience object that groups all API methods, for pages that
// prefer `api.post(...)` style imports: `import { api } from '@/lib/api'`
export const api = {
  get,
  post,
  put,
  delete: del,
  upload,
};
