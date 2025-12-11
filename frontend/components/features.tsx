"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import Image from 'next/image';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description, delay = 0 }) => (
  <div
    className="group animate-fadeInUp"
    style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`
    }}
  >
    <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 blur-xl" />
      </div>

      {/* Icon container */}
      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 text-3xl shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
        <span className="relative z-10">{icon}</span>
      </div>

      {/* Content */}
      <h3 className="relative text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="relative text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl" />
    </div>

    <style jsx>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Image
        src="target-user.svg"
        alt="targer-user"
        width={40}
        height={40}
      ></Image>,
      title: "Retos Prácticos",
      description: "Aprende haciendo con desafíos reales de pentesting y CTF"
    },
    {
      icon: <Image
        src="hack-files.svg"
        alt="laboratory"
        width={40}
        height={40}
      ></Image>,
      title: "Laboratorios Estructurados",
      description: "Contenido organizado desde nivel básico hasta avanzado"
    },
    {
      icon: <Image
        src="security.svg"
        alt="security"
        width={40}
        height={40}
      >
      </Image>,
      title: "Seguridad Real",
      description: "Técnicas actualizadas usadas por profesionales"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 py-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ¿Por qué elegirnos?
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          La plataforma más completa para aprender ciberseguridad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} delay={index * 100} />
        ))}
      </div>
    </section>
  );
};