"use client";
import { useEffect, useRef } from "react";
import { fetcher } from "../lib/api"; // Ajusta la ruta si tu fetcher está en otro lugar

const REFRESH_INTERVAL = 60 * 1000; // 1 minuto
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos

export function useSessionKeepAlive() {

  // eslint-disable-next-line react-hooks/purity
  const lastActivityRef = useRef(Date.now());

  // Detectar actividad del usuario
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // Refrescar el token periódicamente si hay actividad reciente
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      if (now - lastActivityRef.current < INACTIVITY_LIMIT) {
        try {
          await fetcher('/auth/refresh', {
            method: "POST",
            credentials: "include",
          });
        } catch {
          // Si falla, probablemente el refresh token expiró
          // Aquí podrías redirigir al login o mostrar un mensaje
        }
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);
}