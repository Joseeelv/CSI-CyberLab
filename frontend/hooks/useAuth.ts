import { useEffect, useState } from 'react';
import { authFetch, ApiError } from '@/lib/api';
import { User } from '@/types/user';
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
        const data = await authFetch('/auth/me');
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
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
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
