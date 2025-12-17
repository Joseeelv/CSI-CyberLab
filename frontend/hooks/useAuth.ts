import { useEffect, useState } from 'react';
import { authFetch, fetcher, ApiError } from '@/lib/api';
import { AuthState } from '@/types/AuthState';


export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });


  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authFetch('/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const user = data?.payload ?? data; // Add fallback logic to handle different response structures
        setState({
          user,
          loading: false,
          error: null,
          isAuthenticated: !!user,
        });
      } catch (err) {
        const error = err as ApiError;

        // 401 is expected when not logged in, don't treat as error
        if (error.statusCode === 401) {
          // Si recibes 401, intenta refrescar usando cookie
          try {
            await fetcher('/auth/refresh', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            // Reintenta la petición original
            const retry = await authFetch('/auth/me', {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            });
            const user = retry?.payload ?? retry;
            setState({
              user,
              loading: false,
              error: null,
              isAuthenticated: !!user,
            });
            return;
          } catch {
            // El refresh falló, forzar logout
            setState({
              user: null,
              loading: false,
              error: null,
              isAuthenticated: false,
            });
            return;
          }
        } else {
          setState({
            user: null,
            loading: false,
            error: error.message || 'Authentication failed',
            isAuthenticated: false,
          });
        }
      }
    };
    loadUser();
  }, []);

  return state;
}
