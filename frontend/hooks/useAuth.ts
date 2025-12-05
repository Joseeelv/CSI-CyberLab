import { useEffect, useState } from 'react';
import { authFetch, ApiError } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
}

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
        const data = await authFetch('/auth/me');
        setState({
          user: data.payload,
          loading: false,
          error: null,
          isAuthenticated: true,
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
