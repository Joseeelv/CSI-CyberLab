"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import { User } from "@/types/user";

export default function Profile() {
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetcher("/users/students", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setStudents(data);
      } catch (err) {
        console.error("Error al cargar los estudiantes:", err);
      }
    };
    loadStudents();
  }, []);

  return (
    <div className="overflow-x-auto max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center flex items-center justify-center gap-2">
        <svg
          className="w-7 h-7 text-cyan-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-7.13a4 4 0 11-8 0 4 4 0 018 0zM15 20a2 2 0 01-2 2h-2a2 2 0 01-2-2"
          />
        </svg>
        Lista de Estudiantes
      </h2>
      <table className="min-w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-cyan-700 rounded-xl shadow-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-cyan-700 text-left text-cyan-300 font-semibold text-sm">
              Avatar
            </th>
            <th className="py-3 px-4 border-b border-cyan-700 text-left text-cyan-300 font-semibold text-sm">
              Nombre Completo
            </th>
            <th className="py-3 px-4 border-b border-cyan-700 text-left text-cyan-300 font-semibold text-sm">
              Usuario
            </th>
            <th className="py-3 px-4 border-b border-cyan-700 text-left text-cyan-300 font-semibold text-sm">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 px-4 text-center text-gray-400">
                No hay estudiantes registrados.
              </td>
            </tr>
          )}
          {students.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-cyan-900/10 transition-colors"
            >
              <td className="py-2 px-4 border-b border-cyan-800">
                <div className="w-10 h-10 rounded-full bg-cyan-700/30 flex items-center justify-center text-cyan-200 font-bold text-lg shadow-inner">
                  {student.fullName ? student.fullName[0] : student.username[0]}
                </div>
              </td>
              <td className="py-2 px-4 border-b border-cyan-800 font-medium text-white">
                {student.fullName || (
                  <span className="italic text-gray-400">Sin nombre</span>
                )}
              </td>
              <td className="py-2 px-4 border-b border-cyan-800 text-cyan-300 font-mono">
                @{student.username}
              </td>
              <td className="py-2 px-4 border-b border-cyan-800 text-gray-200">
                {student.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
