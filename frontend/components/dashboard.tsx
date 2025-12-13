"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { fetcher } from '@/lib/api';
import { LabCard } from './LabCard';
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPayload, setUserPayload] = useState<any>(null);
  const [selected, setSelected] = useState<null | 'labs' | 'settings' | 'rankings'>(null);
  const [labs, setLabs] = useState<any[]>([]);
  const [difficultyMap, setDifficultyMap] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  function AnimatedPanel({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      // small delay to allow initial render then transition in
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => {
        window.cancelAnimationFrame(id);
        setVisible(false);
      };
    }, []);

    return (
      <div className={`transition-all duration-500 ease-out transform ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-40'}`}>
        {children}
      </div>
    );
  }

  useEffect(() => {
    const check = async () => {
      try {
        const data = await fetcher('/auth/me'); // Corregido: se asigna el resultado de fetcher a 'data'
        setUserPayload(data.payload ?? data);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);


  useEffect(() => {
    const check = async () => {
      try {
        const data = await fetcher('/labs');

        if (!Array.isArray(data)) {
          console.error('Expected array, got:', typeof data);
          setLabs([]);
          return;
        }

        setLabs(data);

        // Create a new map of difficulty IDs to names for easy lookup
        const newDifficultyMap: { [key: number]: string } = {};
        data.forEach((lab) => {
          if (lab.difficulty && lab.difficulty.id !== undefined) {
            newDifficultyMap[lab.difficulty.id] = lab.difficulty.name;
          }
        });
        setDifficultyMap(newDifficultyMap);

      } catch (err) {
        console.error('Error fetching labs:', err);
        setLabs([]);
      }
    };
    check();
  }, [difficultyMap]);

  if (loading) return <div className="p-8">Comprobando sesión...</div>;
  if (!userPayload) return null;

  return (
    <div className="flex flex-col top-0 ">
      <div className="p-8">
        <h1 className="text-4xl mt-4 text-white">
          Bienvenido{' '}
          <span className="font-semibold text-cyan-400">
            {userPayload?.name ?? userPayload?.email ?? 'Usuario'}
          </span>
          !
        </h1>
      </div>

      <div className="text-center w-full px-6">
        <div className="flex flex-row flex-wrap gap-4 justify-start items-center px-6 mb-6">
          <Button
            onClick={() => setSelected('labs')}
            variant={selected === 'labs' ? 'linkselected' : 'link'}
            size="lg"
            aria-pressed={selected === 'labs'}
            className={`${selected === 'labs' ? 'transform scale-105 shadow-[0_0_28px_rgba(99,102,241,0.18)]' : ''} w-full sm:w-auto transition-transform duration-300`}
          >
            Ver Laboratorios
          </Button>

          <Button
            onClick={() => setSelected('settings')}
            variant={selected === 'settings' ? 'linkselected' : 'link'}
            size="lg"
            aria-pressed={selected === 'settings'}
            className={`${selected === 'settings' ? 'transform scale-105 shadow-[0_0_28px_rgba(99,102,241,0.18)]' : ''} w-full sm:w-auto transition-transform duration-300`}
          >
            Configuración
          </Button>

          <Button
            onClick={() => setSelected('rankings')}
            variant={selected === 'rankings' ? 'linkselected' : 'link'}
            size="lg"
            aria-pressed={selected === 'rankings'}
            className={`${selected === 'rankings' ? 'transform scale-105 shadow-[0_0_28px_rgba(99,102,241,0.18)]' : ''} w-full sm:w-auto transition-transform duration-300`}
          >
            Ver Rankings
          </Button>
        </div>

        <div className="max-w-4xl mx-auto w-full px-6 text-white">
          {(selected == 'labs' || selected == null) && (
            <AnimatedPanel>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {labs.map((lab, index) => (
                  <LabCard key={lab.uuid || `lab-${index}`} lab={lab} isActive={false} />
                ))}
              </div>
            </AnimatedPanel>
          )}

          {selected === 'settings' && (
            <AnimatedPanel>
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4">
                <h2 className="text-2xl font-bold text-white mb-2">Configuración de la Cuenta</h2>
                <p className="text-gray-300 mb-4">Aquí puedes actualizar tu perfil, cambiar contraseña y ajustar preferencias.</p>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-800/60 rounded">Nombre: {userPayload?.name ?? '—'}</div>
                  <div className="p-4 bg-gray-800/60 rounded">Email: {userPayload?.email ?? '—'}</div>
                </div>

                {/* Poner formulario de configuración */}
              </section>
            </AnimatedPanel>
          )}

          {selected === 'rankings' && (
            <AnimatedPanel>
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4">
                <h2 className="text-2xl font-bold text-white mb-2">Rankings</h2>
                <p className="text-gray-300 mb-4">Clasificación de usuarios por puntos y logros.</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-200">
                  {/* Poner rankings de la base de datos */}
                </ol>
              </section>
            </AnimatedPanel>
          )}
        </div>
      </div>
      {/* Mostrar el contenido de los botones aquí */}
      <div>

      </div>
    </div>
  );
}