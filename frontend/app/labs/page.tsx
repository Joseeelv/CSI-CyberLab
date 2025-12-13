"use client";
import { useState, useEffect } from 'react';
import { LabCard } from '@/components/LabCard';
import { LabFilters } from '@/components/LabFilters';
import { ActiveLabPanel } from '@/components/ActiveLabPanel';
import { Header } from '@/components/header';
import { fetcher } from '@/lib/api';
import { Lab, ActiveLab } from '@/types/lab';

export default function LabPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [activeLab, setActiveLab] = useState<ActiveLab | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch labs on mount
  useEffect(() => {
    const loadLabs = async () => {
      try {
        const data = await fetcher('/labs');
        setLabs(data);
        setFilteredLabs(data);
      } catch (error) {
        console.error('Error loading labs:', error);
        // Fallback to empty array or show error
        setLabs([]);
        setFilteredLabs([]);
      } finally {
        setLoading(false);
      }
    };
    loadLabs();
  }, []);

  // Filter labs based on selected filters
  useEffect(() => {
    let filtered = labs;

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(lab => selectedDifficulties.includes(lab.difficulty?.name));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(lab =>
        selectedCategories.includes(lab.category?.name ?? '')
      );
    }

    if (selectedOS.length > 0) {
      filtered = filtered.filter(lab => selectedOS.includes(lab.operatingSystem?.name));
    }

    if (searchQuery) {
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

  const handleStartLab = (labId: string) => {
    const lab = labs.find(l => l.uuid === labId);
    if (!lab) return;

    // Mock lab instance creation
    const newActiveLab: ActiveLab = {
      labId,
      startTime: Date.now(),
      duration: lab.estimatedTime * 2, // Give double time
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      url: `https://lab-${labId}.cyberlabs.com`
    };

    setActiveLab(newActiveLab);
  };

  const handleStopLab = () => {
    setActiveLab(null);
  };



  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Laboratorios Prácticos
            </span>
          </h2>
          <p className="text-gray-300 mb-8" style={{ fontSize: '18px' }}>
            Pon a prueba tus habilidades en entornos reales. Inicia un laboratorio y accede a tu instancia privada.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Cargando laboratorios...</p>
          </div>
        ) : (
          <>
            {/* Active Lab Panel */}
            {activeLab && (
              <div className="mb-8">
                <ActiveLabPanel
                  activeLab={activeLab}
                  lab={labs.find(l => l.uuid === activeLab.labId)!}
                  onStop={handleStopLab}
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
            <div className="mb-8 flex items-center justify-between">
              <p className="text-gray-400">
                Mostrando <span className="text-cyan-400">{filteredLabs.length}</span> de <span className="text-cyan-400">{labs.length}</span> laboratorios
              </p>
            </div>

            {/* Labs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map(lab => (
                <LabCard
                  key={lab.uuid}
                  lab={lab}
                  isActive={activeLab?.labId === lab.uuid}
                  onStart={handleStartLab}
                  onStop={handleStopLab}
                />
              ))}
            </div>

            {filteredLabs.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400" style={{ fontSize: '18px' }}>
                  No se encontraron laboratorios con los filtros seleccionados
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
