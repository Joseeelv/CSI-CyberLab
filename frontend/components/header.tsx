"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetcher } from '@/lib/api';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Evitar que la rueda del ratón haga scroll cuando el cursor está sobre el header
    const headerEl = document.querySelector('header');
    const onWheel = () => {
      // si quieres bloquear TODO el scroll sobre header descomenta la siguiente línea
      // e.preventDefault();
    };

    if (headerEl) {
      headerEl.addEventListener('wheel', onWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (headerEl) headerEl.removeEventListener('wheel', onWheel as EventListener);
    };
  }, []);

  const handleLogoutClick = async () => {
    try {
      await fetcher('/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed' + err);
      alert('Error al cerrar sesión. Por favor, inténtalo de nuevo.'); // Mostrar un mensaje al usuario
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-[#0a0e1a]/95 backdrop-blur-xl shadow-lg shadow-cyan-500/5 border-b border-cyan-500/20'
          : 'bg-transparent border-b border-gray-800/50'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
        >
          <span className="h-10 text-4xl font-bold font-logo bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:drop-shadow-[0_0_25px_rgba(0,212,255,0.9)] transition-all duration-300 ">
            CyberLabs
          </span>
        </Link>
        {!isAuthenticated && (
          <div className="flex items-center gap-3 flex-col sm:flex-row ">
            <Link
              href="/login"
            >
              <Button variant="ghost">
                Iniciar Sesión
              </Button>
            </Link>
            <Link
              href="/register"
            >
              <Button variant="primary">
                Registrarse
              </Button>
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <div className="flex items-center gap-3 flex-col sm:flex-row ">
            <Button variant="ghost" onClick={handleLogoutClick}>
              Cerrar Sesión
            </Button>
          </div>
        )}
      </nav>
    </header >
  );
}

export default Header;