"use client";
import React, { useCallback } from "react";
import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { fetcher } from '@/lib/api';
import { Lab, ActiveLab } from '@/types/lab';
import { useAuth } from '@/hooks/useAuth';
import { Footer } from '@/components/footer';
import Dashboard from '@/components/dashboard';

export default function LabPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [, setFilteredLabs] = useState<Lab[]>([]);
  const [selectedDifficulties] = useState<string[]>([]);
  const [selectedCategories] = useState<string[]>([]);
  const [selectedOS] = useState<string[]>([]);
  const [activeLab, setActiveLab] = useState<ActiveLab | null>(null);
  const [searchQuery] = useState('');
  const [, setLoading] = useState(true);
  const { user } = useAuth(); // Obtén el usuario autenticado
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const activePanelRef = useRef<HTMLDivElement>(null);


  // Fetch labs on mount
  useEffect(() => {
    const loadLabs = async () => {
      try {
        const data = await fetcher('/labs', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
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

  // Cargar laboratorios completados del usuario
  useEffect(() => {
    const fetchCompletedLabs = async () => {
      if (!user?.id) {
        setCompletedLabs([]);
        return;
      }
      // Intenta cargar de localStorage primero
      const stored = localStorage.getItem(`completedLabs_${user.id}`);
      if (stored) {
        try {
          setCompletedLabs(JSON.parse(stored));
          return;
        } catch { }
      }
      // Si no hay en localStorage, consulta al backend
      try {
        const submissions = await fetcher(`/flag-submission?userId=${user.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const completed = Array.isArray(submissions)
          ? submissions.filter((f) => f.isCorrect && (f.userId === user.id || f.user?.id === user.id)).map((f) => f.labId?.uuid || f.labUuid || f.labId)
          : [];
        setCompletedLabs([...new Set(completed)]);
      } catch {
        setCompletedLabs([]);
      }
    };
    fetchCompletedLabs();
  }, [user]);

  // Guardar completedLabs en localStorage cuando cambie
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`completedLabs_${user.id}`, JSON.stringify(completedLabs));
    }
  }, [completedLabs, user?.id]);

  // Cargar activeLab desde localStorage al montar y hacer scroll si existe
  useEffect(() => {
    const stored = localStorage.getItem('activeLab');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validar que no haya expirado
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

  // Guardar activeLab en localStorage cuando cambie
  useEffect(() => {
    if (activeLab) {
      localStorage.setItem('activeLab', JSON.stringify(activeLab));
    } else {
      localStorage.removeItem('activeLab');
    }
  }, [activeLab]);

  const handleStartLab = useCallback((labId: string) => {
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
    setTimeout(() => {
      activePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [labs]);

  useEffect(() => {
    const labToActivate = localStorage.getItem('labToActivate');
    if (labToActivate && labs.length > 0) {
      handleStartLab(labToActivate);
      localStorage.removeItem('labToActivate');
    }
  }, [labs, handleStartLab]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <Dashboard />

      <Footer />
    </div>
  );
}