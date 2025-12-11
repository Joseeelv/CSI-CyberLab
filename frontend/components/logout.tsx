import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
export default function Logout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        await fetcher(`/auth/logout`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Error during logout:', err);
      } finally {
        setIsLoggingOut(false);
        router.push('/');
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