// frontend/src/app/admin/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth"; // Caminho do hook
export default function AdminLoginPage() {
  const router = useRouter();
  const { setApiKey, isAuthenticated } = useAdminAuth();
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  // Se já estiver autenticado, redireciona para a listagem
  if (isAuthenticated) {
    router.push("/admin/intencoes");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // **NOTA DE INTEGRAÇÃO:** Não validamos a chave aqui. A validação real
    // ocorrerá na primeira chamada à API no painel de intenções.
    if (inputKey.length > 5) {
      setApiKey(inputKey);
      router.push("/admin/intencoes");
    } else {
      setError("A chave secreta é muito curta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-red-600">
          Área de Administração
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Acesso protegido por API Key (simulação de login)
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700"
            >
              Chave Secreta (ADMIN_SECRET)
            </label>
            <input
              id="apiKey"
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-red-500 focus:border-red-500"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700"
          >
            Acessar Painel
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm bg-red-100 text-red-700 p-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
