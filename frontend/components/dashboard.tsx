"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPayload, setUserPayload] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
        const endpoint = API_URL ? `${API_URL}/auth/me` : '/auth/me';
        const res = await fetch(endpoint, { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUserPayload(data.payload ?? data);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  if (loading) return <div className="p-8">Comprobando sesión...</div>;
  if (!userPayload) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-lg mt-4 text-white">
        Hola {userPayload.name}! Bienvenido a tu panel de usuario:
      </p>
    </div>
  );
}