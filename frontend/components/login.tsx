'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Image from 'next/image';
import { BackgroundGradient } from './backgroundGradient';
import { fetcher, type ApiError } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Nuevo estado para cerrar
  const router = useRouter();

  useEffect(() => {
    // Animación de entrada cuando el componente se monta
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Verificar que la respuesta tenga la estructura esperada
      if (!data || typeof data !== 'object') {
        throw new Error('Respuesta inválida del servidor');
      }

      // Redirigir según el rol
      const roleData = (data as any);
      const roleName = roleData?.role?.name || roleData?.user?.role?.name;
      if (roleName === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Credenciales inválidas. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Inicia la animación de cierre
    setIsClosing(true);

    // Espera a que termine la animación antes de redirigir (coincide con duration: 500ms)
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] p-4 relative overflow-hidden">
      <BackgroundGradient />

      {/* El formulario con la animación aplicada */}
      <div
        id="login-form"
        style={{ willChange: 'transform, opacity' }}
        className={`w-full max-w-md relative z-10 ${isClosing
          ? 'animate-fadeOutSlideDown'
          : isVisible
            ? 'animate-fadeInSlideUp'
            : 'opacity-0'
          }`}
      >
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/20">
          {/* Close button */}
          <Button
            variant="close"
            size="sm"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            X
          </Button>

          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-40 animate-pulse" />
                <div className="relative rounded-full p-3">
                  <Image src="/logo.png" alt="Logo" width={80} height={80} />
                </div>
              </div>
            </div>

            <h2 className="text-center text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Bienvenido de Nuevo
            </h2>
            <p className="text-center text-gray-400 mb-8">
              Inicia sesión en tu cuenta
            </p>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 p-4 border border-red-500/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-medium text-red-300">{error}</h3>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    ¿Olvidaste la contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full px-6 py-3 font-semibold rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <span className="relative z-10 text-[#0a0e1a] font-bold">
                    {isLoading ? 'Entrando...' : 'Iniciar Sesión'}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}