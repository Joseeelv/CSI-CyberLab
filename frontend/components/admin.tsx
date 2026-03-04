"use client";
import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import { RankingGeneral } from "@/components/ranking";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Lab } from "@/types/lab";
import { UserLab } from "@/types/userLab";

const TABS = [
  { key: "users", label: "Usuarios" },
  { key: "labs", label: "Laboratorios" },
  { key: "rankings", label: "Rankings" },
  { key: "stats", label: "Estadísticas" },
];

export default function AdminPanel() {
  const [tab, setTab] = useState("users");
  const [userAction, setUserAction] = useState("listar");
  const [labAction, setLabAction] = useState("listar");
  const [rankingAction, setRankingAction] = useState("ver");
  const [labs, setLabs] = useState<Lab[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [rankings, setRankings] = useState<UserLab[]>([]);
  const [labId, setLabId] = useState("");
  const [labData, setLabData] = useState({
    name: "",
    description: "",
    difficulty: "beginner",
    available: true,
  });
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    roleId: { name: "teacher" },
  });
  const [formError, setFormError] = useState<string | string[] | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication and admin role
  const [userPayload, setUserPayload] = useState<unknown>(null);

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
        const payload =
          data && typeof data === "object" && "payload" in data && data.payload
            ? data.payload
            : data;
        setUserPayload(payload);

        // Si no es admin, redirigir
        if (!payload || payload.role !== "admin") {
          router.replace("/");
        }
        setLoading(true);
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

  // Usuarios
  const handleUserAction = async (action: unknown) => {
    setLoading(true);
    try {
      switch (action) {
        case "listar":
          try {
            const response = await fetcher("/admin/get-users", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            setUsers(Array.isArray(response) ? response : []);
            console.log("Fetched users:", response);
          } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setUsers([]);
          } finally {
            setLoading(false);
          }
          break;
        case "crear":
          setFormError(null);
          try {
            // Solo enviar los campos requeridos por el backend
            const payload = {
              username: userData.username,
              email: userData.email,
              fullName: userData.fullName,
              roleId: 3, // Asignar rol de docente
              password: userData.password,
            };
            const response = await fetcher("/admin/create-teacher", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            if (response && response.statusCode && response.statusCode >= 400) {
              setFormError(response.message || "Error al crear usuario");
              return;
            }
            setFormSuccess("Usuario creado exitosamente");
            setUserData({
              username: "",
              fullName: "",
              email: "",
              password: "",
              roleId: { name: "teacher" },
            });
          } catch (error) {
            const msg = "Error al crear usuario";
            setFormError(msg);
            console.error("Error al crear usuario:", error);
          } finally {
            setLoading(false);
          }
          break;
        case "editar":
          try {
            const updatePayload: Record<string, unknown> = {};
            if (userData.username) updatePayload.username = userData.username;
            if (userData.fullName) updatePayload.fullName = userData.fullName;
            if (userData.email) updatePayload.email = userData.email;
            if (userData.password) updatePayload.password = userData.password;
            console.log("Updating user:", userId, updatePayload);
            await fetcher(`/admin/update-user/${userId}`, {
              method: "PATCH",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatePayload),
            });
            setFormSuccess("Usuario actualizado exitosamente");
          } catch {
            setFormError("Error al actualizar el usuario");
          } finally {
            setLoading(false);
          }
          break;
        case "eliminar":
          try {
            await fetcher(`/admin/remove-user/${userId}`, {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
            setFormSuccess("Usuario eliminado exitosamente");
            setUserData({
              username: "",
              fullName: "",
              email: "",
              password: "",
              roleId: { name: "teacher" },
            });
          } catch {
            const msg = "Error al eliminar usuario";
            setFormError(msg);
          } finally {
            setLoading(false);
          }
          break;
      }
    } catch (error) {
      console.error("Error en acción de usuario:", error);
      setLoading(false);
    }
  };

  // Laboratorios
  const handleLabAction = async (action: unknown) => {
    setLoading(true);
    try {
      switch (action) {
        case "listar":
          try {
            const response = await fetcher("/labs", {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
            setLabs(Array.isArray(response) ? response : []);
          } catch (err) {
            console.error("Error al obtener laboratorios:", err);
            setLabs([]);
          } finally {
            setLoading(false);
          }
          break;
        case "crear":
          try {
            await fetcher("/labs", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(labData),
            });
            setFormSuccess("Laboratorio creado exitosamente");
            setLabData({
              name: "",
              description: "",
              difficulty: "beginner",
              available: true,
            });
          } catch {
            const msg = "Error al crear laboratorio";
            setFormError(msg);
          } finally {
            setLoading(false);
          }
          break;
        case "editar":
          try {
            await fetcher(`/labs/${labId}`, {
              method: "PATCH",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(labData),
            });
            setFormSuccess("Laboratorio actualizado exitosamente");
          } catch {
            setFormError("Error al actualizar el laboratorio");
          } finally {
            setLoading(false);
          }
          break;
        case "eliminar":
          try {
            await fetcher(`/labs/${labId}`, {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
            setFormSuccess("Laboratorio eliminado exitosamente");
          } catch {
            setFormError("Error al eliminar el laboratorio");
          } finally {
            setLoading(false);
          }
          break;
      }
    } catch (error) {
      console.error("Error en acción de laboratorio:", error);
      setLoading(false);
    }
  };

  // Rankings
  const handleRankingAction = async (action: unknown) => {
    setLoading(true);
    try {
      switch (action) {
        case "ver":
          try {
            <RankingGeneral />;
          } catch (err) {
            console.error("Error al obtener rankings:", err);
            setRankings([]);
          } finally {
            setLoading(false);
          }
          break;
        case "resetear":
          try {
            const response = await fetcher("/user-lab", {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log("Rankings reset response:", response);
          } catch (err) {
            console.error("Error al resetear rankings:", err);
          } finally {
            setLoading(false);
          }
          if (
            confirm("¿Estás seguro de que deseas resetear todos los rankings?")
          ) {
            try {
              await fetcher("/user-lab", {
                method: "DELETE",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              setFormSuccess("Rankings reseteados exitosamente.");
            } catch (error) {
              setFormError("Error al resetear los rankings.");
              console.error("Error al resetear rankings:", error);
            }
          }
          break;
      }
    } catch (error) {
      console.error("Error en acción de ranking:", error);
      setLoading(false);
    }
  };

  // Cargar datos según la acción seleccionada
  useEffect(() => {
    if (tab === "users" && userAction === "listar") {
      handleUserAction("listar");
    } else if (tab === "labs" && labAction === "listar") {
      handleLabAction("listar");
    } else if (tab === "rankings" && rankingAction === "ver") {
      handleRankingAction("ver");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, userAction, labAction, rankingAction]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <span className="text-gray-400 text-xl">Cargando...</span>
      </div>
    );
  }

  // Si el usuario no es admin o el chequeo no pasó, no renderizar nada
  type UserPayload = { role?: string };

  const typedPayload = userPayload as UserPayload;

  if (!typedPayload || typedPayload.role !== "admin") {
    return null;
  }

  return (
    <div className="p-4 text-white min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
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

      {tab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Gestión de Usuarios</h2>
          <p className="text-gray-400 mb-4">
            Administra usuarios del sistema: creación, edición, eliminación y
            roles.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <label
              htmlFor="userCrudSelector"
              className="text-gray-300 font-medium"
            >
              Acción:
            </label>
            <select
              id="userCrudSelector"
              className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              style={{ minWidth: 180 }}
              value={userAction}
              onChange={(e) => setUserAction(e.target.value)}
            >
              <option value="listar">Listar usuarios</option>
              <option value="crear">Crear docente</option>
              <option value="editar">Editar docente</option>
              <option value="eliminar">Eliminar docente</option>
            </select>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            {userAction === "listar" && (
              <>
                {loading ? (
                  <div className="text-center text-gray-400">
                    Cargando usuarios...
                  </div>
                ) : users && users.length > 0 ? (
                  <table className="min-w-full text-left text-gray-200">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Nombre de usuario</th>
                        <th className="px-4 py-3">Nombre completo</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-700 hover:bg-gray-750"
                        >
                          <td className="px-4 py-3">{user.id}</td>
                          <td className="px-4 py-3">{user.username}</td>
                          <td className="px-4 py-3">{user.fullName}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-2 bg-cyan-900 text-white rounded text-xs">
                              {user.roleId &&
                              typeof user.roleId === "object" &&
                              user.roleId.name
                                ? user.roleId.name
                                : typeof user.role === "object"
                                ? user.role?.name
                                : typeof user.role === "string"
                                ? user.role
                                : typeof user.role === "number"
                                ? user.role === 1
                                  ? "admin"
                                  : user.role === 2
                                  ? "student"
                                  : user.role === 3
                                  ? "teacher"
                                  : user.role
                                : "desconocido"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-400">
                    No hay usuarios para mostrar.
                  </div>
                )}
              </>
            )}
            {userAction === "crear" && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Crear nuevo docente
                </h3>
                <div className="space-y-4">
                  {formError && (
                    <div className="bg-red-900 text-red-200 rounded p-3 mb-2 text-sm">
                      {Array.isArray(formError)
                        ? formError.map((err, idx) => (
                            <div key={idx}>{err}</div>
                          ))
                        : formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="bg-green-900 text-green-200 rounded p-3 mb-2 text-sm">
                      {formSuccess}
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                      placeholder="Nombre del docente"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userData.fullName}
                      onChange={(e) =>
                        setUserData({ ...userData, fullName: e.target.value })
                      }
                      placeholder="Nombre del docente"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      placeholder="Contraseña segura"
                      required
                    />
                  </div>
                  <button
                    onClick={() => handleUserAction("crear")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Crear Usuario
                  </button>
                </div>
              </div>
            )}
            {userAction === "editar" && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Editar docente
                </h3>
                <div className="space-y-4">
                  {formError && (
                    <div className="bg-red-900 text-red-200 rounded p-3 mb-2 text-sm">
                      {Array.isArray(formError)
                        ? formError.map((err, idx) => (
                            <div key={idx}>{err}</div>
                          ))
                        : formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="bg-green-900 text-green-200 rounded p-3 mb-2 text-sm">
                      {formSuccess}
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      ID del Usuario
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userId}
                      required
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleUserAction("editar")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Actualizar Usuario
                  </button>
                </div>
              </div>
            )}
            {userAction === "eliminar" && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Eliminar docente
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      ID del Usuario
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => handleUserAction("eliminar")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Eliminar Usuario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "labs" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Gestión de Laboratorios
          </h2>
          <p className="text-gray-400 mb-4">
            Crea, edita o elimina laboratorios y gestiona su disponibilidad.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <label
              htmlFor="labCrudSelector"
              className="text-gray-300 font-medium"
            >
              Acción:
            </label>
            <select
              id="labCrudSelector"
              className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              style={{ minWidth: 180 }}
              value={labAction}
              onChange={(e) => setLabAction(e.target.value)}
            >
              <option value="listar">Listar laboratorios</option>
              <option value="crear">Crear laboratorio</option>
              <option value="editar">Editar laboratorio</option>
              <option value="eliminar">Eliminar laboratorio</option>
            </select>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            {labAction === "listar" && (
              <>
                {loading ? (
                  <div className="text-center text-gray-400">
                    Cargando laboratorios...
                  </div>
                ) : labs && labs.length > 0 ? (
                  <table className="min-w-full text-left text-gray-200">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Dificultad</th>
                        <th className="px-4 py-3">Puntos</th>
                        <th className="px-4 py-3">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labs.map((lab) => (
                        <tr
                          key={lab.uuid}
                          className="border-b border-gray-700 hover:bg-gray-750"
                        >
                          <td className="px-4 py-3">{lab.name}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                typeof lab.difficulty === "object"
                                  ? lab.difficulty.name === "Fácil"
                                    ? "bg-green-900 text-green-300"
                                    : lab.difficulty.name === "Intermedio"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-red-900 text-red-300"
                                  : lab.difficulty === "Fácil"
                                  ? "bg-green-900 text-green-300"
                                  : lab.difficulty === "Intermedio"
                                  ? "bg-yellow-900 text-yellow-300"
                                  : "bg-red-900 text-red-300"
                              }`}
                            >
                              {typeof lab.difficulty === "object"
                                ? lab.difficulty.name
                                : lab.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs 
                              }`}
                            >
                              {lab.points}
                            </span>
                          </td>
                          <td className="px-4 py-3">{lab.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-400">
                    No hay laboratorios para mostrar.
                  </div>
                )}
              </>
            )}
            {labAction === "crear" && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Crear nuevo laboratorio
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={labData.name}
                      onChange={(e) =>
                        setLabData({ ...labData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      rows={3}
                      value={labData.description}
                      onChange={(e) =>
                        setLabData({ ...labData, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Dificultad
                    </label>
                    <select
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={labData.difficulty}
                      onChange={(e) =>
                        setLabData({ ...labData, difficulty: e.target.value })
                      }
                    >
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      className="mr-2"
                      checked={labData.available}
                      onChange={(e) =>
                        setLabData({ ...labData, available: e.target.checked })
                      }
                    />
                    <label htmlFor="available" className="text-gray-300">
                      Disponible
                    </label>
                  </div>
                  <button
                    onClick={() => handleLabAction("crear")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Crear Laboratorio
                  </button>
                </div>
              </div>
            )}
            {labAction === "editar" && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Editar laboratorio
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      ID del Laboratorio
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={labId}
                      onChange={(e) => setLabId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={labData.name}
                      onChange={(e) =>
                        setLabData({ ...labData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      rows={3}
                      value={labData.description}
                      onChange={(e) =>
                        setLabData({ ...labData, description: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleLabAction("editar")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Actualizar Laboratorio
                  </button>
                </div>
              </div>
            )}
            {labAction === "eliminar" && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Eliminar laboratorio
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      ID del Laboratorio
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded"
                      value={labId}
                      onChange={(e) => setLabId(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => handleLabAction("eliminar")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Eliminar Laboratorio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "rankings" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Rankings</h2>
          <p className="text-gray-400 mb-4">
            Consulta y administra los rankings generales y por laboratorio.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <label
              htmlFor="rankingCrudSelector"
              className="text-gray-300 font-medium"
            >
              Acción:
            </label>
            <select
              id="rankingCrudSelector"
              className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              style={{ minWidth: 180 }}
              value={rankingAction}
              onChange={(e) => setRankingAction(e.target.value)}
            >
              <option value="ver">Ver rankings</option>
              <option value="resetear">Resetear rankings</option>
            </select>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            {rankingAction === "ver" && (
              <>
                {loading ? (
                  <div className="text-center text-gray-400">
                    Cargando rankings...
                  </div>
                ) : rankings && rankings.length > 0 ? (
                  <table className="min-w-full text-left text-gray-200">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3">Posición</th>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.map((rank, index) => (
                        <tr
                          key={rank.id || index}
                          className="border-b border-gray-700 hover:bg-gray-750"
                        >
                          <td className="px-4 py-3">
                            <span
                              className={`font-bold ${
                                index === 0
                                  ? "text-yellow-400"
                                  : index === 1
                                  ? "text-gray-400"
                                  : index === 2
                                  ? "text-orange-600"
                                  : "text-gray-200"
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {typeof rank.user === "object"
                              ? rank.user.fullName ||
                                rank.user.username ||
                                rank.user.email
                              : rank.user}
                          </td>
                          <td className="px-4 py-3">{rank.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-400">
                    No hay rankings para mostrar.
                  </div>
                )}
              </>
            )}
            {rankingAction === "resetear" && (
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  Resetear Rankings
                </h3>
                <p className="text-gray-400 mb-4">
                  Esta acción eliminará todos los puntos y posiciones del
                  ranking actual. Esta operación no se puede deshacer.
                </p>
                <button
                  onClick={() => handleRankingAction("resetear")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Confirmar Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "stats" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Estadísticas Generales</h2>
          <p className="text-gray-400 mb-4">
            Visualiza estadísticas globales del sistema y actividad de usuarios.
          </p>
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            <span>Las estadísticas están en desarrollo...</span>
          </div>
        </div>
      )}
    </div>
  );
}
