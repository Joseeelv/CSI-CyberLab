const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  message: string;
  statusCode?: number;
}
export async function fetcher(url: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText || 'Request failed'
    }));
    const apiError: ApiError = {
      message: error.message || `HTTP ${response.status}`,
      statusCode: response.status,
    };
    throw apiError;
  }

  return response.json();
}

export async function authFetch(url: string, options?: RequestInit) {
  return fetcher(url, {
    ...options,
    credentials: 'include',
  });
}

export { API_URL };
