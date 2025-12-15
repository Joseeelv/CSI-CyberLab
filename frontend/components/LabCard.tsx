import { Play, Square, Clock, Award, Tag } from 'lucide-react';
import type { Lab } from '@/types/lab';
import { useAuth } from '@/hooks/useAuth';

interface LabCardProps {
  lab: Lab;
  isActive: boolean;
  onStart?: (labId: string) => void;
  onStop?: () => void;
  completedLabs?: string[]; // lista de labId completados
}

const difficultyColors = {
  'Fácil': 'text-green-400 border-green-400',
  'Intermedio': 'text-yellow-400 border-yellow-400',
  'Difícil': 'text-red-400 border-red-400',
  'Experto': 'text-purple-400 border-purple-400'
};

const osColors = {
  'Linux': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Windows': 'bg-sky-500/20 text-sky-300 border-sky-500/30'
};

const categoryColors = {
  'Web': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Network': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Forensics': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Reversing': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Crypto': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'PWN': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Binary': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Cryptography': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Misc': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'Steganography': 'bg-teal-500/20 text-teal-300 border-teal-500/30',

};

export function LabCard({ lab, isActive, onStart, onStop, completedLabs = [] }: LabCardProps) {

  const { isAuthenticated } = useAuth();
  const isCompleted = completedLabs.includes(lab.uuid);


  return (
    <div
      className={`
        bg-gray-900/50 border rounded-lg p-6 transition-all duration-300 hover:border-cyan-500/50
        ${isActive ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-gray-800'}
        w-full h-full min-h-[320px] max-h-[380px] min-w-[260px] max-w-[480px] flex flex-col
      `}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white mb-2" style={{ fontSize: '20px' }}>
            {lab.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`
              px-2 py-1 rounded text-xs border
              ${difficultyColors[lab.difficulty?.name as keyof typeof difficultyColors]}
            `}>
              {lab.difficulty?.name}
            </span>
            {lab.category && (
              <span
                key={lab.category.id}
                className={`
                  px-2 py-1 rounded text-xs border
                  ${categoryColors[lab.category.name as keyof typeof categoryColors]}
                `}
              >
                {lab.category.name}
              </span>
            )}
            <span className={`
              px-2 py-1 rounded text-xs border
              ${osColors[lab.operatingSystem?.name as keyof typeof osColors]}
            `}>
              {lab.operatingSystem?.name}
            </span>
          </div>
        </div>

        {isActive && (
          <div className="ml-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {lab.description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(Array.isArray(lab.tags) ? lab.tags : []).map((tag: string) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800/50 text-gray-400 rounded text-xs"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Info */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{lab.estimatedTime} min</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Award className="w-4 h-4" />
          <span>{lab.points} pts</span>
        </div>
      </div>

      {/* Action Button */}
      {isActive ? (
        <button
          onClick={() => onStop?.()}
          className="cursor-pointer hover:transform hover:scale-105 duration-300 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Square className="w-4 h-4" />
          Detener Laboratorio
        </button>
      ) : isCompleted ? (
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold cursor-not-allowed opacity-90"
          disabled
        >
          <Award className="w-4 h-4" />
          Completado
        </button>
      ) : (
        <button
          onClick={() => isAuthenticated && onStart?.(lab.uuid)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${isAuthenticated
            ? 'cursor-pointer hover:transform hover:scale-105 duration-300 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white'
            : 'cursor-not-allowed bg-gray-700 text-gray-500 opacity-50'
            }`}
          disabled={!isAuthenticated}
        >
          <Play className="w-4 h-4" />
          {isAuthenticated ? 'Iniciar Laboratorio' : 'Inicia sesión para empezar'}
        </button>
      )}
    </div>
  );
}