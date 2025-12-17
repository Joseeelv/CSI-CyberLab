"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import Profile from "@/components/profile";
import { RankingGeneral } from "@/components/ranking";
import { Lab } from "@/types/lab";

const LabCard = ({
  lab,
  isActive,
  onToggle,
  isUpdating,
}: {
  lab: Lab;
  isActive: boolean;
  onToggle: () => void;
  isUpdating: boolean;
  statusId?: number | string;
}) => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <h3 className="text-lg font-semibold mb-2">{lab.name}</h3>
    <p className="text-sm text-gray-400 mb-3">
      {lab.description || "Sin descripción"}
    </p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">ID: {lab.uuid}</span>
      <button
        onClick={onToggle}
        disabled={isUpdating}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          isUpdating
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : isActive
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-700 text-gray-300 hover:bg-cyan-600"
        }`}
      >
        {isUpdating ? "Actualizando..." : isActive ? "Activo" : "Inactivo"}
      </button>
    </div>
  </div>
);

const TABS = [
  { key: "labs", label: "Laboratorios" },
  { key: "students", label: "Seguimiento de Alumnos" },
  { key: "stats", label: "Estadísticas" },
];

// Utilidad para obtener el nombre del estado
const getStatusName = (id: number) => (id === 2 ? "Activo" : "Inactivo");

export default function Teacher() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("labs");
  const [updatingLabs, setUpdatingLabs] = useState(new Set());

  // Cargar labs al montar el componente
  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      // Llama a la API y recibe directamente los datos
      const data: Lab[] = await fetcher("/labs", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Normalizar los datos para asegurar que status?.id y status?.name estén presentes
      const normalizedLabs = data.map((lab: Lab) => ({
        ...lab,
        status: lab.status
          ? lab.status
          : {
              id: Number(lab.statusId) || 1,
              name: getStatusName(Number(lab.statusId) || 1),
            },
      }));

      setLabs(normalizedLabs);
      setLoading(false);
    } catch (error) {
      console.error("Error loading labs:", error);
      setLabs([]);
      setLoading(false);
    }
  };

  // Función para actualizar el estado de un laboratorio
  const toggleLabStatus = async (labId: string) => {
    // Prevenir múltiples actualizaciones simultáneas
    if (updatingLabs.has(labId)) return;

    const lab = labs.find((l) => l.uuid === labId);
    if (!lab) return;

    // Determinar el nuevo estado
    const currentStatusId = lab.status?.id || lab.statusId || 1;
    const newStatusId = currentStatusId === 2 ? 1 : 2;

    // Marcar como actualizando
    setUpdatingLabs((prev) => new Set(prev).add(labId));

    // Actualización optimista
    setLabs((prevLabs) =>
      prevLabs.map((l) =>
        l.uuid === labId
          ? {
              ...l,
              status: {
                ...l.status,
                id: newStatusId,
                name: getStatusName(newStatusId), // <--- Siempre incluye name
              },
              statusId: newStatusId,
            }
          : l
      )
    );

    try {
      // Llamada al backend (fetcher ya devuelve el objeto actualizado o lanza error)
      console.log("PATCH body:", { statusId: newStatusId });
      const updatedLab = await fetcher(`/labs/status/${labId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId: newStatusId }),
      });

      // Actualizar con la respuesta del servidor para confirmar
      setLabs((prevLabs) =>
        prevLabs.map((l) =>
          l.uuid === labId
            ? {
                ...updatedLab,
                status: updatedLab.status || {
                  id: updatedLab.statusId || newStatusId,
                },
                statusId:
                  updatedLab.statusId || updatedLab.status?.id || newStatusId,
              }
            : l
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      if (error instanceof Response) {
        error.text().then((text) => {
          console.error("Respuesta del backend:", text);
        });
      }

      // Revertir el cambio optimista
      setLabs((prevLabs) =>
        prevLabs.map((l) =>
          l.uuid === labId
            ? {
                ...l,
                status: {
                  ...l.status,
                  id: Number(currentStatusId),
                  name: getStatusName(Number(currentStatusId)),
                },
                statusId: Number(currentStatusId),
              }
            : l
        )
      );

      alert(
        "Error al actualizar el estado del laboratorio. Por favor, intenta de nuevo."
      );
    } finally {
      // Remover el flag de actualización
      setUpdatingLabs((prev) => {
        const next = new Set(prev);
        next.delete(labId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Panel de Profesor</h1>

        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 font-semibold transition-colors ${
                tab === t.key
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "labs" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Gestión de Laboratorios
            </h2>
            <p className="text-gray-400 mb-6">
              Activa o desactiva laboratorios para los alumnos. Los cambios se
              guardan automáticamente.
            </p>
            {loading ? (
              <div className="text-gray-400 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-2"></div>
                <p>Cargando laboratorios...</p>
              </div>
            ) : labs.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">No hay laboratorios disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {labs.map((lab) => {
                  // Considerar activo si status.id o statusId es 2, o name es "Activo"
                  const isActive =
                    lab.status?.id === 2 ||
                    lab.statusId === 2 ||
                    lab.status?.name === "Activo";
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const isInactive =
                    lab.status?.id === 1 ||
                    lab.statusId === 1 ||
                    lab.status?.name === "Inactivo";
                  const isUpdating = updatingLabs.has(lab.uuid);

                  return (
                    <LabCard
                      key={lab.uuid}
                      lab={lab}
                      isActive={isActive}
                      onToggle={() => toggleLabStatus(lab.uuid)}
                      isUpdating={isUpdating}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "students" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Seguimiento de Alumnos
            </h2>
            <p className="text-gray-400 mb-4">
              Consulta el progreso y resultados de tus alumnos en los
              laboratorios asignados.
            </p>
            <Profile />
          </div>
        )}

        {tab === "stats" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Estadísticas de Progreso
            </h2>
            <p className="text-gray-400 mb-4">
              Visualiza estadísticas generales y comparativas de tus
              laboratorios y alumnos.
            </p>
            <RankingGeneral />
          </div>
        )}
      </div>
    </div>
  );
}
