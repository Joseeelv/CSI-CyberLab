// components/Logo.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'glow' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gradient',
  size = 'md',
  showText = true
}) => {
  const sizes = {
    sm: { height: 32, fontSize: 'text-xl' },
    md: { height: 40, fontSize: 'text-2xl' },
    lg: { height: 56, fontSize: 'text-4xl' }
  };

  const glowClass = variant === 'glow' ? 'drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]' : '';

  return (
    <div className="flex items-center gap-3">
      {/* Usa tu logo como imagen */}
      <div className={`relative ${glowClass}`} style={{ height: sizes[size].height }}>
        <svg
          viewBox="0 0 100 100"
          style={{ height: sizes[size].height, width: 'auto' }}
          className="transition-all duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#00ff9f', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* Aquí deberías poner el path de tu logo SVG */}
          {/* Por ahora, usa la imagen directamente */}
        </svg>
      </div>

      {showText && (
        <span className={`font-bold tracking-tight bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-info)] to-[var(--accent-purple)] bg-clip-text text-transparent ${sizes[size].fontSize}`}>
          CyberLabs
        </span>
      )}
    </div>
  );
};
