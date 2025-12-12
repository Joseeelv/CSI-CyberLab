"use client";
import { useState, useEffect } from 'react';
import { Server, Globe, Clock, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import type { Lab, ActiveLab } from '../app/labs/page';

interface ActiveLabPanelProps {
  activeLab: ActiveLab;
  lab: Lab;
  onStop: () => void;
}

export function ActiveLabPanel({ activeLab, lab, onStop }: ActiveLabPanelProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - activeLab.startTime;
      const remaining = Math.max(0, activeLab.duration * 60 * 1000 - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        onStop();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeLab, onStop]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const percentRemaining = (timeRemaining / (activeLab.duration * 60 * 1000)) * 100;
  const isLowTime = percentRemaining < 20;

  return (
    <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-cyan-400" style={{ fontSize: '24px' }}>
              Laboratorio Activo
            </h3>
          </div>
          <p className="text-white" style={{ fontSize: '20px' }}>
            {lab.name}
          </p>
        </div>
      </div>

      {/* Time Remaining */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-400' : 'text-cyan-400'}`} />
            <span className="text-gray-300">Tiempo restante</span>
          </div>
          <span className={`${isLowTime ? 'text-red-400' : 'text-white'}`} style={{ fontSize: '20px' }}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isLowTime 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-cyan-500 to-purple-500'
            }`}
            style={{ width: `${percentRemaining}%` }}
          />
        </div>
        {isLowTime && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>¡Tiempo bajo! Guarda tu progreso</span>
          </div>
        )}
      </div>

      {/* Access Information */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* IP Address */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-sm">Dirección IP</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <code className="text-white">{activeLab.ip}</code>
            <button
              onClick={() => copyToClipboard(activeLab.ip, 'ip')}
              className=" cursor-pointer text-gray-400 hover:text-cyan-400 transition-colors"
              title="Copiar IP"
            >
              {copiedField === 'ip' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* URL */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-sm">URL de Acceso</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <a
              href={activeLab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-sm truncate"
            >
              Abrir Lab
            </a>
            <button
              onClick={() => copyToClipboard(activeLab.url, 'url')}
              className="cursor-pointer text-gray-400 hover:text-cyan-400 transition-colors"
              title="Copiar URL"
            >
              {copiedField === 'url' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-4">
        <h4 className="text-white mb-2">Instrucciones de Conexión</h4>
        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
          <li>Usa SSH para conectarte: <code className="text-cyan-400">ssh user@{activeLab.ip}</code></li>
          <li>Accede a la aplicación web mediante la URL proporcionada</li>
          <li>Escanea los puertos abiertos para encontrar servicios vulnerables</li>
          <li>Guarda tus hallazgos antes de que expire el tiempo</li>
        </ul>
      </div>

      {/* Stop Button */}
      <button
        onClick={onStop}
        className="cursor-pointer w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Detener y Finalizar Laboratorio
      </button>
    </div>
  );
}
