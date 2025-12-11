"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { fetcher } from '@/lib/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPayload, setUserPayload] = useState<any>(null);
  const [selected, setSelected] = useState<null | 'labs' | 'settings' | 'rankings'>(null);
  const [labs, setLabs] = useState<any[]>([]);
  const [difficultyMap, setDifficultyMap] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  function AnimatedPanel({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
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
      setLoading(true);
      try {
        const data = await fetcher('/auth/me');
        const user = data.user ?? data.payload ?? data;
        setUserPayload(user);
      } catch (err) {
        // Not authenticated or other error — redirect to login
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  useEffect(() => {
    const loadLabs = async () => {
      try {
        const res = await fetcher('/labs');
        // API returns { data: Lab[], meta: {...} } — extraer la lista
        const list = Array.isArray(res) ? res : (res?.data ?? []);

        if (!Array.isArray(list)) {
          console.error('Expected labs array, got:', res);
          setLabs([]);
          return;
        }

        setLabs(list);
        // Crear mapa de dificultades con key string (si lo necesitas)
        const map: { [key: string]: string } = {};
        list.forEach((lab: any) => {
          if (lab?.difficulty?.id && lab?.difficulty?.name) {
            map[String(lab.difficulty.id)] = lab.difficulty.name;
          }
        });
        setDifficultyMap(map);
      } catch (err) {
        console.error('Error fetching labs:', err);
        setLabs([]);
      }
    };
    loadLabs();
  }, []);

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
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4">
                <h2 className="text-2xl font-bold text-white mb-2">Laboratorios</h2>
                <p className="text-gray-300 mb-4">Lista de laboratorios disponibles y progreso.</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {labs.map((lab) => (
                    <li key={lab.uuid} className="p-4 bg-gray-800/60 rounded">
                      {lab.name} — {lab.difficulty?.name ?? 'Dificultad desconocida'} — {lab.operatingSystem?.name ?? 'S.O. desconocido'}
                    </li>
                  ))}
                </ul>
              </section>
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
      <div></div>
    </div>
  );
}