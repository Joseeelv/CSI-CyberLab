"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { fetcher } from "@/lib/api";
import { LabCard } from "./LabCard";
import { LabFilters } from "@/components/LabFilters";
import { ActiveLabPanel } from "@/components/ActiveLabPanel";
import { Lab, ActiveLab } from "@/types/lab";
import { User } from "@/types/user";
import { RankingGeneral } from "./ranking";

function AnimatedPanel({
  children,
  animate,
}: {
  children: React.ReactNode;
  animate?: boolean;
}) {
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
    <div
      className={`transition-all duration-500 ease-out transform ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-40"
      }`}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPayload, setUserPayload] = useState<User | null>(null);
  const [selected, setSelected] = useState<"labs" | "settings" | "rankings">(
    "labs"
  );
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLab, setActiveLab] = useState<ActiveLab | null>(null);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const activePanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const check = async () => {
      try {
        const data = await fetcher("/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        // Si la respuesta tiene .payload, usarla, si no, usar el objeto completo
        if (
          data &&
          typeof data === "object" &&
          "payload" in data &&
          data.payload
        ) {
          setUserPayload(data.payload);
        } else {
          setUserPayload(data);
        }
      } catch (err) {
        // Oculta el error 401 (no autenticado), pero muestra otros errores
        if (
          !(
            typeof err === "object" &&
            err !== null &&
            "statusCode" in err &&
            typeof (err as { statusCode?: unknown }).statusCode === "number" &&
            (err as { statusCode: number }).statusCode === 401
          )
        ) {
          console.error(
            "Auth check failed:",
            typeof err === "object" &&
              err !== null &&
              "message" in err &&
              typeof (err as { message?: unknown }).message === "string"
              ? (err as { message: string }).message
              : err
          );
        }
        setUserPayload(null);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  //Obtener el nombre de usuario por documentId
  useEffect(() => {
    const documentId = userPayload?.id;
    if (!documentId) {
      // No hacer fetch si no hay documentId
      return;
    }
    const fetchUserName = async () => {
      try {
        const data = await fetcher(`/users/document-id/${documentId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUserPayload((prev) => ({
          ...prev,
          username: data.username ?? prev?.username,
          fullName: data.fullName ?? prev?.fullName,
          email: data.email ?? prev?.email,
          id: data.documentId ?? prev?.id,
        }));
      } catch (err) {
        console.error(
          "Failed to fetch user name:",
          (err as Error)?.message || err
        );
      }
    };
    fetchUserName();
  }, [userPayload?.id]);

  // Load labs (actualiza datos de usuario si cambia el id)
  useEffect(() => {
    const documentId = userPayload?.id;
    if (!documentId) {
      // No hacer fetch si no hay documentId
      return;
    }
    const fetchUserName = async () => {
      try {
        const data = await fetcher(`/users/document-id/${documentId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUserPayload((prev) => ({
          ...prev,
          username: data.username ?? prev?.username,
          fullName: data.fullName ?? prev?.fullName,
          email: data.email ?? prev?.email,
          id: data.documentId ?? prev?.id,
        }));
      } catch (err) {
        console.error(
          "Failed to fetch user name:",
          (err as Error)?.message || err
        );
      }
    };
    fetchUserName();
  }, [userPayload?.id]);

  // Load labs
  useEffect(() => {
    const loadLabs = async () => {
      try {
        const data = await fetcher("/labs", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLabs(data);
        setFilteredLabs(data);
      } catch (error) {
        // Intenta mostrar el mensaje de error si existe
        if ((error as Error)?.message) {
          console.error("Error loading labs:", (error as Error).message, error);
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: unknown }).response === "object" &&
          (error as { response?: { data?: unknown } }).response !== null &&
          "data" in (error as { response?: { data?: unknown } }).response!
        ) {
          console.error(
            "Error loading labs:",
            (error as { response: { data?: unknown } }).response.data,
            error
          );
        } else {
          console.error("Error loading labs:", error);
        }
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
      filtered = filtered.filter((lab) =>
        selectedDifficulties.includes(lab.difficulty?.name)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((lab) =>
        selectedCategories.includes(lab.category?.name ?? "")
      );
    }

    if (selectedOS.length > 0) {
      filtered = filtered.filter((lab) =>
        selectedOS.includes(lab.operatingSystem?.name)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query) ||
          lab.category?.name.toLowerCase().includes(query) ||
          lab.difficulty?.name.toLowerCase().includes(query) ||
          lab.operatingSystem?.name.toLowerCase().includes(query) ||
          (Array.isArray(lab.tags) &&
            lab.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }
    setFilteredLabs(filtered);
  }, [selectedDifficulties, selectedCategories, selectedOS, searchQuery, labs]);

  // Load completed labs
  // Sincroniza completedLabs con el backend usando isFinished
  useEffect(() => {
    interface UserLab {
      userId: string;
      isFinished: boolean;
      labId: string | { uuid: string };
    }

    const fetchCompletedLabs = async () => {
      if (!userPayload?.id) {
        setCompletedLabs([]);
        return;
      }
      try {
        const userLabs = await fetcher("/user-lab", { credentials: "include" });
        // Filtra los labs completados por el usuario
        const completed = (userLabs || [])
          .filter(
            (ul: unknown): ul is UserLab =>
              typeof ul === "object" &&
              ul !== null &&
              "userId" in ul &&
              "isFinished" in ul &&
              "labId" in ul
          )
          .filter(
            (ul: UserLab) =>
              ul.userId === userPayload.id && ul.isFinished && ul.labId
          )
          .map((ul: UserLab) => {
            if (
              typeof ul.labId === "object" &&
              ul.labId !== null &&
              "uuid" in ul.labId
            ) {
              return ul.labId.uuid;
            }
            return String(ul.labId);
          });
        setCompletedLabs(completed);
      } catch {
        setCompletedLabs([]);
      }
    };
    fetchCompletedLabs();
  }, [userPayload]);

  // Save completed labs to localStorage
  useEffect(() => {
    if (userPayload?.id) {
      localStorage.setItem(
        `completedLabs_${userPayload.id}`,
        JSON.stringify(completedLabs)
      );
    }
  }, [completedLabs, userPayload?.id]);

  // Load active lab from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("activeLab");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const elapsed = Date.now() - parsed.startTime;
        if (elapsed < parsed.duration * 60 * 1000) {
          setActiveLab(parsed);
          setTimeout(() => {
            activePanelRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 100);
        } else {
          localStorage.removeItem("activeLab");
        }
      } catch {}
    }
  }, []);

  // Save active lab to localStorage
  useEffect(() => {
    if (activeLab) {
      localStorage.setItem("activeLab", JSON.stringify(activeLab));
    } else {
      localStorage.removeItem("activeLab");
    }
  }, [activeLab]);

  // Handler para iniciar un laboratorio
  const handleStartLab = (labId: string) => {
    const lab = labs.find((l) => l.uuid === labId);
    if (!lab) return;

    const newActiveLab: ActiveLab = {
      labId,
      startTime: Date.now(),
      duration: (lab.estimatedTime ?? 30) * 2, // fallback a 30 si no existe
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}`,
      url: `https://lab-${labId}.cyberlabs.com`,
    };

    // Si iniciamos un nuevo laboratorio, lo registramos en el backend
    const registerUserLab = async () => {
      if (!userPayload) return;
      try {
        const response = await fetcher("/user-lab", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            labUuid: labId,
            userId: userPayload.id,
          }),
        });
        // Si ya está registrado, no hacemos nada
        if (response && response.exists) {
          return;
        }
      } catch (err) {
        // Si el error es porque ya existe, no hacemos nada
        if (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message?: unknown }).message === "string" &&
          (err as { message: string }).message.includes("already exists")
        ) {
          return;
        }
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 409
        ) {
          return;
        }
        console.error("Error registering user lab:", err);
      }
    };
    registerUserLab();

    setActiveLab(newActiveLab);
    setTimeout(() => {
      activePanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleStopLab = () => {
    setActiveLab(null);
  };

  const handleLabComplete = async (labId: string) => {
    if (!userPayload?.id) return;
    try {
      // Buscar el registro UserLab correspondiente
      interface UserLab {
        id: string;
        userId: string;
        isFinished: boolean;
        labId: string | { uuid: string };
      }
      const userLabs = await fetcher("/user-lab", { credentials: "include" });
      const userLab = (userLabs || []).find(
        (ul: unknown): ul is UserLab =>
          typeof ul === "object" &&
          ul !== null &&
          "userId" in ul &&
          "labId" in ul &&
          "id" in ul
      );
      if (
        userLab &&
        userLab.userId === userPayload.id &&
        userLab.labId === labId
      ) {
        await fetcher(`/user-lab/${userLab.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFinished: true }),
        });
        // Refresca la lista de labs completados
        const updatedUserLabs = await fetcher("/user-lab", {
          credentials: "include",
        });
        const completed = (updatedUserLabs || [])
          .filter(
            (ul: unknown): ul is UserLab =>
              typeof ul === "object" &&
              ul !== null &&
              "userId" in ul &&
              "isFinished" in ul &&
              "labId" in ul
          )
          .filter(
            (ul: UserLab) =>
              ul.userId === userPayload.id && ul.isFinished && ul.labId
          )
          .map((ul: UserLab) => {
            if (
              typeof ul.labId === "object" &&
              ul.labId !== null &&
              "uuid" in ul.labId
            ) {
              return ul.labId.uuid;
            }
            return String(ul.labId);
          });
        setCompletedLabs(completed);
      }
    } catch {
      // Manejo de error opcional
    }
  };

  if (loading)
    return <div className="p-8 text-white">Comprobando sesión...</div>;
  if (!userPayload) return null;

  const currentLab = activeLab
    ? labs.find((l: Lab) => l.uuid === activeLab.labId)
    : null;

  return (
    <div className="flex flex-col">
      <div className="p-10">
        <h1 className="text-4xl mt-4 text-white">
          Bienvenido{" "}
          <span className="font-semibold text-cyan-400">
            {userPayload.username ?? "Usuario"}
          </span>
          !
        </h1>
      </div>

      <div className="w-full px-6 mb-20">
        <div className="flex flex-row flex-wrap gap-4 justify-start items-center px-6 mb-6">
          <Button
            onClick={() => setSelected("labs")}
            variant={selected === "labs" ? "linkselected" : "link"}
            size="lg"
            aria-pressed={selected === "labs"}
          >
            Ver Laboratorios
          </Button>

          <Button
            onClick={() => setSelected("settings")}
            variant={selected === "settings" ? "linkselected" : "link"}
            size="lg"
            aria-pressed={selected === "settings"}
          >
            Configuración
          </Button>

          <Button
            onClick={() => setSelected("rankings")}
            variant={selected === "rankings" ? "linkselected" : "link"}
            size="lg"
            aria-pressed={selected === "rankings"}
          >
            Ver Rankings
          </Button>
        </div>

        <div className="max-w-8xl mx-auto w-full px-10 text-white">
          {selected === "labs" ? (
            <AnimatedPanel>
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
                  Mostrando{" "}
                  <span className="text-cyan-400">{filteredLabs.length}</span>{" "}
                  de <span className="text-cyan-400">{labs.length}</span>{" "}
                  laboratorios
                </p>
              </div>

              {/* Labs Grid */}
              <div
                id="labs-panel"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
              >
                {filteredLabs.map((lab) => (
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

          {selected === "settings" && (
            <AnimatedPanel>
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4 ">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Configuración de la Cuenta
                </h2>
                <p className="text-gray-300 mb-4">
                  Aquí puedes actualizar tu perfil, cambiar contraseña y ajustar
                  preferencias.
                </p>
                <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Información del Perfil
                  </h3>
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setError(null);
                      setSuccess(null);
                      setInfo(null);
                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const name = formData.get("fullName")?.toString().trim();
                      const username = formData
                        .get("username")
                        ?.toString()
                        .trim();
                      const email = formData.get("email")?.toString().trim();
                      const password = formData.get("password")?.toString();
                      const body: Partial<{
                        username: string;
                        fullName: string;
                        email: string;
                        password: string;
                      }> = {};
                      if (username && username !== userPayload?.username) {
                        body.username = username;
                      }
                      if (name && name !== userPayload?.fullName) {
                        body.fullName = name;
                      }
                      if (email && email !== userPayload?.email) {
                        body.email = email;
                      }
                      if (password) {
                        body.password = password;
                      }
                      if (Object.keys(body).length === 0) {
                        setInfo("No hay cambios para guardar.");
                        return;
                      }
                      try {
                        await fetcher(`/users/${userPayload?.id}`, {
                          method: "PATCH",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(body),
                        });
                        // Volver a pedir los datos actualizados
                        const updated = await fetcher(
                          `/users/document-id/${userPayload?.id}`,
                          {
                            method: "GET",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                          }
                        );
                        setUserPayload((prev) => ({
                          ...prev,
                          username: updated.username ?? prev?.username,
                          fullName: updated.fullName ?? prev?.fullName,
                          email: updated.email ?? prev?.email,
                          id: updated.documentId ?? prev?.id,
                        }));
                        setSuccess("Datos actualizados correctamente.");
                      } catch (err) {
                        let msg = "Error al actualizar los datos";
                        const errorMsg =
                          (err as Error)?.message ??
                          (typeof err === "string" ? err : "");
                        if (errorMsg) msg += `: ${errorMsg}`;
                        setError(msg);
                      }
                    }}
                    onChange={() => {
                      setError(null);
                      setSuccess(null);
                      setInfo(null);
                    }}
                  >
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Nick del Usuario
                      </label>
                      <input
                        type="text"
                        name="username"
                        defaultValue={userPayload?.username || ""}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Nombre del Usuario
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        defaultValue={userPayload?.fullName || ""}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={userPayload?.email || ""}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Nueva Contraseña
                      </label>
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
                      <div className="text-green-400 text-sm mb-2">
                        {success}
                      </div>
                    )}
                    {info && (
                      <div className="text-blue-400 text-sm mb-2">{info}</div>
                    )}
                    <Button variant="ghost" size="md" type="submit">
                      Guardar Cambios
                    </Button>
                  </form>
                </section>
              </section>
            </AnimatedPanel>
          )}

          {selected === "rankings" && (
            <AnimatedPanel>
              <section className="bg-gray-900/70 rounded-xl p-6 mt-4  overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Ranking General
                </h2>
                <p className="text-gray-300 mb-4">
                  Clasificación de usuarios por puntos y logros.
                </p>
                <RankingGeneral />
                <ol className="list-decimal list-inside space-y-2 text-gray-200"></ol>
              </section>
            </AnimatedPanel>
          )}
        </div>
      </div>
    </div>
  );
}
