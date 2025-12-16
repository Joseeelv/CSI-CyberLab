'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const primaryText = loading ? 'Cargando...' : isAuthenticated ? 'Ir al Dashboard' : 'Comenzar ahora';
  console.log('Hero render - isAuthenticated:', isAuthenticated, 'loading:', loading);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden py-24 px-5">

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-10xl animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(14, 204, 233, 0.4) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-2xl animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(134, 59, 246, 0.4) 0%, transparent 70%)', animationDelay: '1s' }}
      />


      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Aprende Ciberseguridad
          </span>
          <br />
          <span className="text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            desde cero
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Laboratorios prácticos, retos y seguimiento para todos los niveles.
          Domina las técnicas de hacking ético.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={isAuthenticated ? '/dashboard' : '/register'}>
            <Button variant="secondary" size="lg" disabled={loading}>
              {primaryText}
            </Button>
          </Link>
          <Link href="/labs">
            <Button variant="inverse" size="lg">
              Ver Laboratorios
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            transform: translateY(100vh);
            opacity: 0.3;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};