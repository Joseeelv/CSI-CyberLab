// components/stats.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  trend?: { value: string; positive: boolean };
  progress?: number;
  variant?: 'default' | 'success' | 'warning' | 'critical';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  trend,
  progress,
  variant = 'default',
  icon
}) => {
  const [mounted, setMounted] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    if (progress !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const variantColors = {
    default: {
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-400/20',
      border: 'border-cyan-500/30'
    },
    success: {
      gradient: 'from-emerald-400 to-green-500',
      glow: 'shadow-emerald-400/20',
      border: 'border-emerald-500/30'
    },
    warning: {
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-400/20',
      border: 'border-amber-500/30'
    },
    critical: {
      gradient: 'from-red-400 to-rose-500',
      glow: 'shadow-red-400/20',
      border: 'border-red-500/30'
    }
  };

  const colors = variantColors[variant];

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6 
        bg-gradient-to-br from-gray-900/50 to-gray-800/50 
        backdrop-blur-xl
        border ${colors.border}
        hover:border-opacity-60
        transition-all duration-300 
        hover:-translate-y-2 
        hover:shadow-2xl ${colors.glow}
        group
      `}
    >
      {/* Animated border glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-10 blur-xl`} />
      </div>

      {icon && (
        <div className="absolute top-4 right-4 text-gray-600 group-hover:text-gray-500 opacity-30 text-4xl transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
      
      <div className={`relative text-5xl font-black font-mono leading-none mb-2 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      
      <div className="relative text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
        {label}
      </div>
      
      {trend && mounted && (
        <div className={`relative inline-flex items-center gap-1 text-xs font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
          <span className="text-base">{trend.positive ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
        </div>
      )}
      
      {progress !== undefined && mounted && (
        <div className="relative mt-3 h-1.5 bg-gray-800/80 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${animatedProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export const Stats: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          value="99.9%" 
          label="Uptime" 
          trend={{ value: "2.1%", positive: true }}
          variant="success"
          progress={99.9}
          icon="✓"
        />
        <StatCard 
          value="1.2M" 
          label="Tests Executed" 
          progress={75}
          icon="⚡"
        />
        <StatCard 
          value="24" 
          label="Critical Alerts" 
          trend={{ value: "8.3%", positive: false }}
          variant="critical"
          icon="⚠"
        />
      </div>
    </section>
  );
};