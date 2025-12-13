import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Logout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
        const endpoint = API_URL ? `${API_URL}/auth/logout` : '/auth/logout';
        await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Error during logout:', err);
      } finally {
        setIsLoggingOut(false);
        router.push('/login');
      }
    };
    logout();
  }, [router]);

  return (
    <div className="p-8">
      {isLoggingOut ? 'Cerrando sesión...' : 'Redirigiendo a la página de login...'}
    </div>
  );
}