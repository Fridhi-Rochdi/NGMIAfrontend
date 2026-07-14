const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  data: T;
  status: number;
}

interface ApiError {
  message: string;
  statusCode: number;
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
  return {
    data,
    status: response.status,
  };
}

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}),
    },
  });
  
  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}),
    },
    body: JSON.stringify(body),
  });
  
  return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}),
    },
    body: JSON.stringify(body),
  });
  
  return handleResponse<T>(response);
}

export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}),
    },
  });
  
  return handleResponse<T>(response);
}
