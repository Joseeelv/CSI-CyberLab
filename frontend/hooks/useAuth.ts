import { useEffect, useState } from 'react';
import { authFetch, type ApiError, type User, type AuthResponse } from '@/lib/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

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
        const data = await authFetch<AuthResponse>('/auth/me');

        // Extraer usuario de diferentes estructuras posibles
        const user = data?.user ?? data?.payload ?? (data as any);

        // Validar que tengamos al menos un email o id
        if (!user?.email && !user?.id) {
          throw new Error('Invalid user data');
        }

        setState({
          user: user as User,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      } catch (err) {
        const error = err as ApiError;

        // 401 es esperado cuando no está logueado
        if (error.statusCode === 401) {
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        } else {
          console.error('Auth error:', error);
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
