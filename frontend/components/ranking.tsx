"use client";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { Lab, ActiveLab } from "@/types/lab";
import { User } from "@/types/user";

// Ranking general sumando puntos de todos los labs por usuario
export function RankingGeneral() {
  const [ranking, setRanking] = useState<
    Array<{ user: unknown; score: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await fetcher("/user-lab", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("=== DEBUG RANKING GENERAL ===");
        console.log("Total user-labs en BD:", data.length);

        // Agrupar por userId (no por user.id) y sumar scores de TODOS los labs
        const userScores: Record<string, { user: User; score: number }> = {};

        data.forEach((item) => {
          // IMPORTANTE: Usar item.userId como clave (el UUID de la tabla User_Lab)
          const userId = item.userId;

          if (!userScores[userId]) {
            userScores[userId] = {
              user: item.user,
              score: 0,
            };
          }

          // Sumar el score de este laboratorio
          userScores[userId].score += Number(item.score) || 0;
        });

        const rankingArr = Object.values(userScores).sort(
          (a, b) => b.score - a.score
        );

        console.log(`📊 Ranking General: ${rankingArr.length} usuarios únicos`);
        console.table(
          rankingArr.map((r, idx) => ({
            posición: idx + 1,
            usuario: r.user.username,
            "puntos totales": r.score,
          }))
        );
        console.log("=========================");

        setRanking(rankingArr);
      } catch (err) {
        console.error("Error al obtener el ranking general:", err);
        setError("Error al obtener el ranking general");
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  if (loading) return <div>Cargando ranking general...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-hidden rounded-lg border border-cyan-500/10 flex-1">
      <div className="bg-slate-900/50">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-cyan-500/10">
          <div className="col-span-3 text-gray-400 text-xs uppercase tracking-wider">
            Pos
          </div>
          <div className="col-span-5 text-gray-400 text-xs uppercase tracking-wider">
            Usuario
          </div>
          <div className="col-span-4 text-right text-gray-400 text-xs uppercase tracking-wider">
            Puntos
          </div>
        </div>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {ranking.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-500">
            No hay datos de ranking aún.
          </div>
        )}
        {ranking.map((item, idx) => (
          <div
            key={item.user.id ? `${item.user.id}-${idx}` : idx}
            className={
              `grid grid-cols-12 gap-2 px-4 py-3 border-b border-cyan-500/${
                idx === 0 ? "10" : "5"
              } ` +
              (idx === 0
                ? "bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-medium"
                : "hover:bg-slate-800/30 text-gray-400") +
              " transition-colors"
            }
          >
            <div
              className={
                `col-span-3 flex items-center gap-2 ` +
                (idx === 0 ? "text-cyan-400" : "text-gray-400")
              }
            >
              {idx === 0 ? (
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : null}
              <span className={idx === 0 ? "font-medium" : ""}>{idx + 1}</span>
            </div>
            <div
              className={
                `col-span-5 ` + (idx === 0 ? "text-gray-300" : "text-gray-400")
              }
            >
              {item.user.username}
            </div>
            <div
              className={
                `col-span-4 text-right ` +
                (idx === 0 ? "text-gray-300 font-medium" : "text-gray-400")
              }
            >
              {item.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ranking por laboratorio específico
export function RankingLab({ labId }: { labId?: string }) {
  const [ranking, setRanking] = useState<UserLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar el ranking
  const fetchRanking = async () => {
    if (!labId) return;
    try {
      // Obtener TODOS los user-labs
      const data: UserLab[] = await fetcher(`/user-lab`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("=== DEBUG RANKING LAB ===");
      console.log("Total user-labs en BD:", data.length);

      // Mostrar TODOS los labs con sus usuarios
      const allLabsInfo = data.reduce((acc, item) => {
        const labName = item.lab?.name || item.labId;
        if (!acc[labName]) acc[labName] = [];
        acc[labName].push({
          usuario: item.user.username,
          score: item.score,
          userId: item.user.id,
        });
        return acc;
      }, {});
      console.log("📋 Todos los laboratorios y usuarios:");
      console.table(allLabsInfo);

      console.log("Filtrando por labId:", labId);

      // FILTRAR EN EL FRONTEND por el labId específico
      const filteredData = data.filter((item) => item.labId === labId);

      console.log(
        `✅ User-labs encontrados para este lab: ${filteredData.length}`
      );
      console.table(
        filteredData.map((item) => ({
          id: item.id,
          usuario: item.user.username,
          userId: item.user.id,
          score: item.score,
          progress: item.progress,
          isFinished: item.isFinished,
        }))
      );

      // Mostrar cada usuario UNA SOLA VEZ
      // La clave es userId (no username) para identificar usuarios únicos
      const userScores: Record<string, UserLab> = {};
      filteredData.forEach((item) => {
        // IMPORTANTE: Usar item.userId (el UUID de la BD) como clave
        const userId = item.userId;

        // Si el usuario no existe, agregarlo
        if (!userScores[userId]) {
          userScores[userId] = {
            ...item,
            score: Number(item.score) || 0,
          };
        } else {
          // Si ya existe el mismo userId, es un duplicado REAL
          console.warn(
            `⚠️ Duplicado REAL encontrado para userId ${userId} (${item.user.username}) en lab ${labId}`
          );
          const currentScore = Number(userScores[userId].score) || 0;
          const newScore = Number(item.score) || 0;

          // Tomar el score más alto
          if (newScore > currentScore) {
            userScores[userId] = {
              ...item,
              score: newScore,
            };
          }
        }
      });

      const rankingArr = Object.values(userScores).sort(
        (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
      );

      console.log(`📊 Ranking final: ${rankingArr.length} usuarios únicos`);
      console.table(
        rankingArr.map((r, idx) => ({
          posición: idx + 1,
          usuario: r.user.username,
          userId: r.user.id,
          score: r.score,
          progress: r.progress + "%",
          finalizado: r.isFinished ? "Sí" : "No",
        }))
      );
      console.log("=========================");
      setRanking(rankingArr);
    } catch (err) {
      console.error("Error al obtener el ranking:", err);
      setError("Error al obtener el ranking del laboratorio");
    } finally {
      setLoading(false);
    }
  };

  // Cargar ranking al montar y cada 5 segundos
  useEffect(() => {
    setLoading(true);
    fetchRanking();
    const interval = setInterval(fetchRanking, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId]);

  if (!labId)
    return <div className="text-gray-400">Laboratorio no seleccionado.</div>;
  if (loading) return <div>Cargando ranking del laboratorio...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-hidden rounded-lg border border-cyan-500/10 flex-1">
      <div className="bg-slate-900/50">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-cyan-500/10">
          <div className="col-span-3 text-gray-400 text-xs uppercase tracking-wider">
            Pos
          </div>
          <div className="col-span-5 text-gray-400 text-xs uppercase tracking-wider">
            Usuario
          </div>
          <div className="col-span-4 text-right text-gray-400 text-xs uppercase tracking-wider">
            Puntos
          </div>
        </div>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {ranking.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-500">
            No hay datos de ranking aún para este laboratorio.
          </div>
        )}
        {ranking.map((item, idx) => (
          <div
            key={item.user.id ? `${item.user.id}-${idx}` : idx}
            className={
              `grid grid-cols-12 gap-2 px-4 py-3 border-b border-cyan-500/${
                idx === 0 ? "10" : "5"
              } ` +
              (idx === 0
                ? "bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-medium"
                : "hover:bg-slate-800/30 text-gray-400") +
              " transition-colors"
            }
          >
            <div
              className={
                `col-span-3 flex items-center gap-2 ` +
                (idx === 0 ? "text-cyan-400" : "text-gray-400")
              }
            >
              {idx === 0 ? (
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : null}
              <span className={idx === 0 ? "font-medium" : ""}>{idx + 1}</span>
            </div>
            <div
              className={
                `col-span-5 ` + (idx === 0 ? "text-gray-300" : "text-gray-400")
              }
            >
              {item.user.username}
            </div>
            <div
              className={
                `col-span-4 text-right ` +
                (idx === 0 ? "text-gray-300 font-medium" : "text-gray-400")
              }
            >
              {item.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
