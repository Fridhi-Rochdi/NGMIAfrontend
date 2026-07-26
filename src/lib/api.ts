const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  data: T;
  status: number;
}

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

function buildHeaders(includeContentType = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (includeContentType) headers['Content-Type'] = 'application/json';

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;

    const slug = getTenantSlug();
    if (slug) headers['X-Tenant-Slug'] = slug;
  }

  return headers;
}

async function handleResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    let errorData: { message?: string };
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        message: `HTTP error! status: ${response.status}`,
      };
    }
    const error = new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    ) as Error & {
      response?: { data: typeof errorData; status: number };
    };
    error.response = { data: errorData, status: response.status };
    throw error;
  }

  const json = await response.json();
  const data =
    json &&
    typeof json === 'object' &&
    'data' in json
      ? json.data
      : json;
  return { data: data as T, status: response.status };
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: buildHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>('GET', endpoint);
}

export function post<T>(
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return request<T>('POST', endpoint, body);
}

export function put<T>(
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return request<T>('PUT', endpoint, body);
}

export function patch<T>(
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return request<T>('PATCH', endpoint, body);
}

export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>('DELETE', endpoint);
}

async function uploadFormData<T>(
  endpoint: string,
  formData: FormData,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: buildHeaders(false),
    body: formData,
  });
  return handleResponse<T>(response);
}

export function upload<T>(
  endpoint: string,
  file: File,
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append('file', file);
  return uploadFormData<T>(endpoint, formData);
}

export const api = {
  get,
  post,
  put,
  patch,
  del,
  delete: del,
  upload: uploadFormData,
};
