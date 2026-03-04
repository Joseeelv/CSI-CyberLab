'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { fetcher } from '@/lib/api';
import Image from 'next/image';
import Home from '@/app/page';
import { motion } from 'framer-motion';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Nuevo estado para cerrar
  const router = useRouter();

  useEffect(() => {
    // Animación de entrada cuando el componente se monta
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    setIsLoading(true);
    setError('');

    if (!username.trim()) {
      setError('El nombre de usuario es requerido');
    }

    if (!email.trim()) {
      setError('El email es requerido');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El formato del correo electrónico no es válido');
    }

    if (!password.trim()) {
      setError('La contraseña es requerida');
    } else if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial');
    }

    try {
      await fetcher('/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });
      router.push('/login');
    } catch (err) {
      // Manejar errores del backend
      if (typeof err === 'object' && err !== null && 'message' in err) {
        const message = (err as { message: unknown }).message;
        if (Array.isArray(message)) {
          // Errores de validación del DTO
          message.forEach((msg: string) => {
            if (msg.includes('email')) setError(msg);
            else if (msg.includes('password') || msg.includes('contraseña')) setError(msg);
            else if (msg.includes('username') || msg.includes('usuario')) setError(msg);
            else setError(msg);
          });
        } else if (typeof message === 'string') {
          setError(message);
        } else {
          setError('Error al registrar. Por favor, intenta de nuevo.');
        }
      } else {
        setError('Error al registrar. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleClose = () => {
    // Inicia la animación de cierre
    setIsClosing(true);

    // Espera a que termine la animación antes de redirigir
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  const formAnimation = {
    initial: { opacity: 1, scale: 1 },
    animate: isClosing ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="opacity-30">
          <Home />
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-transparent p-4 relative overflow-hidden h-full w-full"
      >
        {/* El formulario con la animación aplicada */}
        <motion.form
          {...formAnimation}
          id="login-form"
          className="w-full max-w-lg rounded-xl shadow-2xl relative z-10 space-y-6 overflow-hidden"
          onSubmit={handleSubmit} // Maneja el evento de envío del formulario
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e); // Llama al método handleSubmit
            }
          }}
          autoComplete="off"
        >

          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/20">
            <div className="relative top-0 right-4 flex justify-end">
              <Button
                variant="close"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setIsClosing(true);
                  setTimeout(() => handleClose(), 500);
                }}
                aria-label="Cerrar"
              >
                X
              </Button>
            </div>
            <div className="p-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative rounded-full p-3">
                    <Image src="/Logo.png" alt="Logo" width={80} height={80} />
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

              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de Usuario
                  </label>
                  <div className="relative group">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      placeholder="yourusername"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit" // Cambiado a "submit" para que el formulario se envíe correctamente
                    disabled={isLoading}
                    className="relative w-full px-6 py-3 font-semibold rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30 cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <span className="relative z-10 text-[#0a0e1a] font-bold">
                      {isLoading ? 'Registrando cuenta...' : 'Registrarse'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  ¿Tienes cuenta?{' '}
                  <a href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    Inicia sesión
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div >
  );
}