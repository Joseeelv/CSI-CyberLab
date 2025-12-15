"use client";
import { useState, useEffect, useCallback } from 'react';
import { Server, Globe, Clock, Copy, CheckCircle, AlertCircle, Send, Trophy } from 'lucide-react';
import { fetcher } from '@/lib/api';
import { Lab, ActiveLab } from '@/types/lab';

interface User {
  id: string;
  name?: string;
  [key: string]: any;
}

interface ActiveLabPanelProps {
  activeLab: ActiveLab;
  lab: Lab;
  onStop: () => void;
  user: User | null;
  onComplete?: (labId: string) => void;
}

interface FlagSubmission {
  id: number;
  name: string;
  isCorrect: boolean;
  created: string;
}

export function ActiveLabPanel({ activeLab, lab, onStop, user, onComplete }: ActiveLabPanelProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [flag1, setFlag1] = useState('');
  const [flag2, setFlag2] = useState('');
  const [correctFlag1, setCorrectFlag1] = useState<string | null>(null);
  const [correctFlag2, setCorrectFlag2] = useState<string | null>(null);
  const [isSubmitting1, setIsSubmitting1] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [isLoadingFlags, setIsLoadingFlags] = useState(true);
  const [labCompleted, setLabCompleted] = useState(false);

  // Función para cargar las flags del usuario para este laboratorio
  const fetchUserFlags = useCallback(async () => {
    if (!user && !lab) return;
    setIsLoadingFlags(true);
    try {
      // Consulta solo submissions correctas del usuario para este lab
      const submissions: FlagSubmission[] = await fetcher(`/flag-submission?userId=${user?.id}&labUuid=${lab?.uuid}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }
      );
      // Filtrar solo las correctas y ordenar por fecha
      const correctSubmissions = Array.isArray(submissions)
        ? submissions
          .filter((f) => f.isCorrect)
          .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
        : [];

      // Asignar flags en orden cronológico
      if (correctSubmissions.length > 0) {
        setCorrectFlag1(correctSubmissions[0]?.name || null);
        setCorrectFlag2(correctSubmissions[1]?.name || null);
        setLabCompleted(correctSubmissions.length >= 2);
      } else {
        setCorrectFlag1(null);
        setCorrectFlag2(null);
        setLabCompleted(false);
      }
    } catch (err) {
      // Mejor manejo de errores
      if (err instanceof Error) {
        console.error("Error cargando flags:", err.message, err);
      } else if (typeof err === 'object' && err !== null) {
        console.error("Error cargando flags:", JSON.stringify(err), err);
      } else {
        console.error("Error cargando flags:", err);
      }
      setCorrectFlag1(null);
      setCorrectFlag2(null);
      setLabCompleted(false);
    } finally {
      setIsLoadingFlags(false);
    }
  }, [user, lab]);

  // Cargar flags al montar y cuando cambie el usuario o lab
  useEffect(() => {
    fetchUserFlags();
  }, [fetchUserFlags]);

  // Limpiar estado al cambiar de lab 
  useEffect(() => {
    setFlag1('');
    setFlag2('');
    setError(null);
    setSuccess(null);
  }, [lab?.uuid, user?.id]);



  // Mostrar mensaje de completado, notificar al padre y cerrar lab si ambas flags son correctas
  useEffect(() => {
    if (labCompleted && correctFlag1 && correctFlag2 && lab) {
      setSuccess('¡Laboratorio completado! Has encontrado ambas flags correctamente.');
      // Notificar al padre que el lab se completó
      if (onComplete) {
        onComplete(lab.uuid);
      }
      // Cerrar el laboratorio automáticamente si no está ya cerrado
      setTimeout(() => {
        onStop();
      }, 1500); // Espera breve para mostrar el mensaje de éxito
    }
  }, [labCompleted, correctFlag1, correctFlag2, onStop, onComplete, lab]);



  // Timer para el tiempo restante
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - activeLab.startTime;
      const remaining = Math.max(0, activeLab.duration * 60 * 1000 - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        onStop();
      }
    }, 3000);

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

  const flagSubmission = async (flag: string, flagNumber: number) => {
    if (!user) {
      setError('Error: Usuario no encontrado. Por favor, recarga la página e inicia sesión nuevamente.');
      return;
    }

    if (!user.id) {
      setError('Error: Datos de usuario incompletos. Por favor, recarga la página.');
      return;
    }

    if (!flag.trim()) {
      setError('La flag no puede estar vacía');
      return;
    }

    // Verificar si ya tiene esta flag correcta
    if (flagNumber === 1 && correctFlag1) {
      setError('Ya has enviado la Flag 1 correctamente');
      return;
    }
    if (flagNumber === 2 && correctFlag2) {
      setError('Ya has enviado la Flag 2 correctamente');
      return;
    }

    // Marcar como enviando
    if (flagNumber === 1) setIsSubmitting1(true);
    else setIsSubmitting2(true);

    setError(null);
    setSuccess(null);

    try {
      const response = await fetcher('/flag-submission', {
        method: 'POST',
        body: JSON.stringify({
          labUuid: lab.uuid,
          flag: flag.trim(),
          userId: user.id,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Mostrar mensaje de éxito
      setSuccess(response.data?.message || `Flag ${flagNumber} correcta!`);

      // Recargar las flags para actualizar el estado
      await fetchUserFlags();

      // Limpiar el input después de envío exitoso
      if (flagNumber === 1) {
        setFlag1('');
      } else {
        setFlag2('');
      }

    } catch (err) {
      let errorMessage = 'Error al enviar la flag. Por favor, inténtalo de nuevo.';

      if (typeof err === 'object' && err !== null && 'statusCode' in err) {
        const errorObj = err as { statusCode?: number; message?: string };
        if (errorObj.statusCode === 409) {
          errorMessage = errorObj.message || 'Esta flag ya fue enviada anteriormente o ya completaste todas las flags.';
        } else if (errorObj.statusCode === 404) {
          errorMessage = 'Laboratorio o usuario no encontrado.';
        } else if (errorObj.statusCode === 400) {
          errorMessage = errorObj.message || 'Flag incorrecta o datos inválidos.';
        }
      }

      setError(errorMessage);
    } finally {
      if (flagNumber === 1) setIsSubmitting1(false);
      else setIsSubmitting2(false);
    }
  };

  const percentRemaining = (timeRemaining / (activeLab.duration * 60 * 1000)) * 100;
  const isLowTime = percentRemaining < 20;

  // Mostrar advertencia si no hay usuario
  if (!user) {
    return (
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-red-400 text-xl">Inicia Sesión para hacer uso de los laboratorios</h3>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-cyan-400 text-2xl">Laboratorio Activo</h3>
          </div>
          <p className="text-white text-xl">{lab?.name}</p>
        </div>

        {labCompleted && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">Completado</span>
          </div>
        )}
      </div>

      {/* Time Remaining */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-400' : 'text-cyan-400'}`} />
            <span className="text-gray-300">Tiempo restante</span>
          </div>
          <span className={`text-xl ${isLowTime ? 'text-red-400' : 'text-white'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${isLowTime
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
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-sm">Dirección IP</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <code className="text-white">{activeLab.ip}</code>
            <button
              onClick={() => copyToClipboard(activeLab.ip, 'ip')}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
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
              className="text-gray-400 hover:text-cyan-400 transition-colors"
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

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-300 text-sm font-semibold">{success}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingFlags && (
        <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-300 text-sm">Cargando tus flags...</p>
        </div>
      )}

      {/* Flag 1 */}
      <div className="mb-4">
        <label htmlFor="flag1" className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
          Introduce Flag 1:
          {correctFlag1 && <CheckCircle className="w-4 h-4 text-green-400" />}
        </label>
        <div className="flex gap-2">
          {correctFlag1 ? (
            <input
              type="text"
              id="flag1"
              className="flex-1 bg-gray-800/50 border border-green-500 rounded-lg p-3 text-green-300 text-sm outline-none"
              value={correctFlag1}
              readOnly
              disabled
            />
          ) : (
            <>
              <input
                type="text"
                id="flag1"
                placeholder="Escribe la primera flag aquí"
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                value={flag1}
                onChange={(e) => setFlag1(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitting1) {
                    flagSubmission(flag1, 1);
                  }
                }}
                disabled={isSubmitting1 || isLoadingFlags}
              />
              <button
                onClick={() => flagSubmission(flag1, 1)}
                disabled={isSubmitting1 || !flag1.trim() || isLoadingFlags}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                title="Enviar Flag 1"
              >
                {isSubmitting1 ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Flag 2 */}
      <div className="mb-6">
        <label htmlFor="flag2" className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
          Introduce Flag 2:
          {correctFlag2 && <CheckCircle className="w-4 h-4 text-green-400" />}
        </label>
        <div className="flex gap-2">
          {correctFlag2 ? (
            <input
              type="text"
              id="flag2"
              className="flex-1 bg-gray-800/50 border border-green-500 rounded-lg p-3 text-green-300 text-sm outline-none"
              value={correctFlag2}
              readOnly
              disabled
            />
          ) : (
            <>
              <input
                type="text"
                id="flag2"
                placeholder="Escribe la segunda flag aquí"
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                value={flag2}
                onChange={(e) => setFlag2(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitting2) {
                    flagSubmission(flag2, 2);
                  }
                }}
                disabled={isSubmitting2 || isLoadingFlags}
              />
              <button
                onClick={() => flagSubmission(flag2, 2)}
                disabled={isSubmitting2 || !flag2.trim() || isLoadingFlags}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                title="Enviar Flag 2"
              >
                {isSubmitting2 ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-4">
        <h4 className="text-white mb-2 font-medium">Instrucciones de Conexión</h4>
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
        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
      >
        Detener y Finalizar Laboratorio
      </button>
    </div>
  );
}