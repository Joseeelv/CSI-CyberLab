"use client";

import { useEffect, useState } from 'react';
import { HeaderAuth } from './authHeader';
import { Header } from './header';
import { fetcher } from '@/lib/api';
export default function HeaderSwitcher() {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetcher(`/auth/me`, {
          credentials: 'include',
        });
        
        if (!mounted) return;
        
        // Verificar si el usuario está autenticado
        setAuthed(Boolean(data?.authenticated || data?.user || data?.payload));
      } catch (err) {
        if (!mounted) return;
        const error = err as ApiError;
        
        // 401 es esperado cuando no está autenticado
        if (error.statusCode === 401) {
          setAuthed(false);
        } else {
          console.error('Error checking auth:', error);
          setAuthed(false);
        }
      } finally {
        if (!mounted) return;
        setChecked(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Mientras se verifica, renderizamos el HeaderAuth por defecto para evitar salto visual
  if (!checked) return <HeaderAuth />;
  return authed ? <HeaderAuth /> : <Header />;
}
