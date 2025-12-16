"use client";

import { useEffect, useState } from 'react';
import HeaderAuth from './authHeader';
import { Header } from './header';

export default function HeaderSwitcher() {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${base}/auth/me`, {
          credentials: 'include',
        });
        if (!mounted) return;
        setAuthed(res.ok);
      } catch (err) {
        if (!mounted) return;
        setAuthed(false);
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
