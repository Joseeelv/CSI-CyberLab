"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { fetcher } from '@/lib/api';
import { LabCard } from './LabCard';
import { LabFilters } from '@/components/LabFilters';
import { ActiveLabPanel } from '@/components/ActiveLabPanel';
import { Lab, ActiveLab } from '@/types/lab';
import { User } from '@/types/user';

function AnimatedPanel({ children, animate }: { children: React.ReactNode; animate?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let id: number | null = null;
    if (!animate) {
      id = window.requestAnimationFrame(() => setVisible(true));
      return () => {
        if (id !== null) window.cancelAnimationFrame(id);
        setVisible(false);
      };
    }
    id = window.requestAnimationFrame(() => setVisible(true));
    return () => {
      if (id !== null) window.cancelAnimationFrame(id);
      setVisible(false);
    };
  }, [animate]);

  return (
    <div className={`transition-all duration-500 ease-out transform ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-40'}`}>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPayload, setUserPayload] = useState<User | null>(null);
  const [selected, setSelected] = useState<'labs' | 'settings' | 'rankings'>('labs');
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLab, setActiveLab] = useState<ActiveLab | null>(null);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const activePanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  // Check authentication
  useEffect(() => {
    const check = async () => {
      try {
        const data = await fetcher('/auth/me');
        setUserPayload(data.payload ?? data);
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !userPayload) {
      router.replace('/login');
    }
  }, [loading, userPayload, router]);

  // Load labs
  useEffect(() => {
    const loadLabs = async () => {
      try {
        const data = await fetcher('/labs');
        setLabs(data);
        setFilteredLabs(data);
      } catch (error) {
        console.error('Error loading labs:', error);
        setLabs([]);
        setFilteredLabs([]);
      }
    };
    loadLabs();
  }, []);

  // Filter labs
  useEffect(() => {
    let filtered = labs;

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(lab => selectedDifficulties.includes(lab.difficulty?.name));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(lab => selectedCategories.includes(lab.category?.name ?? ''));
    }

    if (selectedOS.length > 0) {
      filtered = filtered.filter(lab => selectedOS.includes(lab.operatingSystem?.name));
    }

    if (searchQuery) {
      console.log("Filtering with search query:", searchQuery);
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lab =>
        lab.name.toLowerCase().includes(query) ||
        lab.description.toLowerCase().includes(query) ||
        lab.category?.name.toLowerCase().includes(query) ||
        lab.difficulty?.name.toLowerCase().includes(query) ||
        lab.operatingSystem?.name.toLowerCase().includes(query) ||
        (Array.isArray(lab.tags) && lab.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    setFilteredLabs(filtered);
  }, [selectedDifficulties, selectedCategories, selectedOS, searchQuery, labs]);

  // Load completed labs
  useEffect(() => {
    const fetchCompletedLabs = async () => {
      if (!userPayload?.id) {
        setCompletedLabs([]);
        return;
      }

      const stored = localStorage.getItem(`completedLabs_${userPayload.id}`);
      if (stored) {
        try {
          setCompletedLabs(JSON.parse(stored));
          return;
        } catch { }
      }

      try {
        const submissions = await fetcher(`/flag-submission?userId=${userPayload.id}`);
        interface Submission {
          isCorrect: boolean;
          userId?: string;
          user?: { id?: string };
          labId?: { uuid?: string };
          labUuid?: string;
        }
        const completed = Array.isArray(submissions)
          ? (submissions as Submission[])
            .filter((f) => f.isCorrect && (f.userId === userPayload.id || f.user?.id === userPayload.id))
            .map((f) => (typeof f.labId === 'object' && f.labId?.uuid) || f.labUuid || (typeof f.labId === 'string' ? f.labId : undefined))
            .filter((id): id is string => !!id)
          : [];
        setCompletedLabs([...new Set(completed)]);
      } catch {
        setCompletedLabs([]);
      }
    };
    fetchCompletedLabs();
  }, [userPayload]);

  // Save completed labs to localStorage
  useEffect(() => {
    if (userPayload?.id) {
      localStorage.setItem(`completedLabs_${userPayload.id}`, JSON.stringify(completedLabs));
    }
  }, [completedLabs, userPayload?.id]);

  // Load active lab from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('activeLab');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const elapsed = Date.now() - parsed.startTime;
        if (elapsed < parsed.duration * 60 * 1000) {
          setActiveLab(parsed);
          setTimeout(() => {
            activePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          localStorage.removeItem('activeLab');
        }
      } catch { }
    }
  }, []);

  // Save active lab to localStorage
  useEffect(() => {
    if (activeLab) {
      localStorage.setItem('activeLab', JSON.stringify(activeLab));
    } else {
      localStorage.removeItem('activeLab');
    }
  }, [activeLab]);

  // Handler para iniciar un laboratorio
  const handleStartLab = (labId: string) => {
    const lab = labs.find(l => l.uuid === labId);
    if (!lab) return;

    const newActiveLab: ActiveLab = {
      labId,
      startTime: Date.now(),
      duration: (lab.estimatedTime ?? 30) * 2, // fallback a 30 si no existe
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      url: `https://lab-${labId}.cyberlabs.com`
    };

    setActiveLab(newActiveLab);
    setTimeout(() => {
      activePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleStopLab = () => {
    setActiveLab(null);
  };

  const handleLabComplete = (labId: string) => {
    if (!completedLabs.includes(labId)) {
      setCompletedLabs([...completedLabs, labId]);
    }
  };

  if (loading) return <div className="p-8 text-white">Comprobando sesión...</div>;
  if (!userPayload) return null;

  const currentLab = activeLab ? labs.find((l: Lab) => l.uuid === activeLab.labId) : null;

  return (
    <div className="flex flex-col">
      <div className="p-10">
        <h1 className="text-4xl mt-4 text-white">
          Bienvenido{' '}
          <span className="font-semibold text-cyan-400">
            {userPayload?.name ?? userPayload?.email ?? 'Usuario'}
          </span>
          !
        </h1>
      </div>

      <div className="w-full px-6 mb-20">
        <div className="flex flex-row flex-wrap gap-4 justify-start items-center px-6 mb-6">
          <Button
            onClick={() => setSelected('labs')}
            variant={selected === 'labs' ? 'linkselected' : 'link'}
            size="lg"
            aria-pressed={selected === 'labs'}
          >
            Ver Laboratorios
          </Button>

          <Button
            onClick={() => setSelected('settings')}
            variant={selected === 'settings' ? 'linkselected' : 'link'}
            size="lg"
            aria-pressed={selected === 'settings'}
          >
            Configuración
          </Button>

          <Button
            onClick={() => setSelected('rankings')}
            variant={selected === 'rankings' ? 'linkselected' : 'link'}
            size="lg"
            aria-pressed={selected === 'rankings'}
          >
            Ver Rankings
          </Button>
        </div>

        <div className="max-w-8xl mx-auto w-full px-10 text-white">
          {selected === 'labs' ? (
            <AnimatedPanel >
              {/* Active Lab Panel */}
              {activeLab && currentLab && (
                <div ref={activePanelRef} className="mb-8">
                  <ActiveLabPanel
                    activeLab={activeLab}
                    lab={currentLab}
                    user={userPayload}
                    onStop={handleStopLab}
                    onComplete={handleLabComplete}
                  />
                </div>
              )}

              {/* Filters */}
              <LabFilters
                selectedDifficulties={selectedDifficulties}
                selectedCategories={selectedCategories}
                selectedOS={selectedOS}
                onDifficultyChange={setSelectedDifficulties}
                onCategoryChange={setSelectedCategories}
                onOSChange={setSelectedOS}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Stats */}
              <div className="mb-6 mt-6 flex items-center justify-between">
                <p className="text-gray-400">
                  Mostrando <span className="text-cyan-400">{filteredLabs.length}</span> de <span className="text-cyan-400">{labs.length}</span> laboratorios
                </p>
              </div>

              {/* Labs Grid */}
              <div id="labs-panel" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {filteredLabs.map(lab => (
                  <LabCard
                    key={lab.uuid}
                    lab={lab}
                    isActive={activeLab?.labId === lab.uuid}
                    onStart={handleStartLab}
                    onStop={handleStopLab}
                    completedLabs={completedLabs}
                  />
                ))}
              </div>

              {filteredLabs.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">
                    No se encontraron laboratorios con los filtros seleccionados
                  </p>
                </div>
              )}
            </AnimatedPanel>
          ) : null}

          {selected === 'settings' && (
            <AnimatedPanel>
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4 ">
                <h2 className="text-2xl font-bold text-white mb-2">Configuración de la Cuenta</h2>
                <p className="text-gray-300 mb-4">Aquí puedes actualizar tu perfil, cambiar contraseña y ajustar preferencias.</p>
                <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Información del Perfil</h3>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const name = formData.get('name')?.toString().trim();
                    const email = formData.get('email')?.toString().trim();
                    const password = formData.get('password')?.toString();
                    const body: Partial<{ username: string; email: string; password: string }> = {};
                    let shouldLogout = false;
                    if (name && name !== userPayload?.username) {
                      body.username = name;
                      shouldLogout = true;
                    }
                    if (email && email !== userPayload?.email) {
                      body.email = email;
                      shouldLogout = true;
                    }
                    if (password) {
                      body.password = password;
                      shouldLogout = true;
                    }
                    if (Object.keys(body).length === 0) {
                      alert('No hay cambios para guardar.');
                      return;
                    }
                    try {
                      const response = await fetcher(`/users/${userPayload?.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                      });
                      // Si el backend devuelve un nuevo JWT, recargar sesión y mostrar mensaje profesional
                      if (response && response.accessToken) {
                        // Guardar JWT en cookie (el backend ya lo setea, pero por si acaso en localStorage)
                        try {
                          localStorage.setItem('jwt', response.accessToken);
                        } catch { }
                        setUserPayload({ ...userPayload, ...body });
                        window.location.reload();
                        return;
                      }
                      setUserPayload({ ...userPayload, ...body });
                      setSuccess('Datos actualizados correctamente.');
                    } catch (err: any) {
                      let msg = 'Error al actualizar los datos';
                      if (err?.message) msg += `: ${err.message}`;
                      setError(msg);
                    }
                  }}>
                    <div>
                      <label className="block text-gray-400 mb-1">Nombre de Usuario</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={userPayload?.name || ''}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={userPayload?.email || ''}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Nueva Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Dejar en blanco para no cambiar"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    {error && (
                      <div className="text-red-400 text-sm mb-2">{error}</div>
                    )}
                    {success && (
                      <div className="text-green-400 text-sm mb-2">{success}</div>
                    )}
                    <Button variant="ghost" size="md" type="submit">
                      Guardar Cambios
                    </Button>
                  </form>
                </section>
              </section>
            </AnimatedPanel>
          )}

          {selected === 'rankings' && (
            <AnimatedPanel>
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4  overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-2">Rankings</h2>
                <p className="text-gray-300 mb-4">Clasificación de usuarios por puntos y logros.</p>
                <p className='text-red-800 border-2 border-red-800 rounded-lg text-3xl text-center'>COMING SOON ...</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-200">
                  {/* Rankings from database */}
                </ol>
              </section>
            </AnimatedPanel>
          )}
        </div>
      </div>
    </div>
  );
}