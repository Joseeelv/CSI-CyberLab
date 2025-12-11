const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export async function fetcher(url: string, options?: RequestInit) {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const response = await fetch(fullUrl, {
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
      message: (errBody as any)?.message || `HTTP ${response.status}`,
      statusCode: response.status,
    };
    throw apiError;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  // If not JSON, return the Response so callers can handle blob/text
  return response;
}

export async function authFetch(url: string, options?: RequestInit) {
  return fetcher(url, {
    ...options,
    credentials: 'include',
  });
}

export { API_URL };
