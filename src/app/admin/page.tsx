"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setApiKey, isAuthenticated, isLoading } = useAdminAuth();
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  
  useEffect(() => {
    
    if (!isLoading && isAuthenticated) {
      
      router.replace("/admin/intencoes");
    }
  }, [isAuthenticated, isLoading, router]);

  
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center text-xl font-bold text-foreground">
        Redirecionando para o Painel de Administração...
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (inputKey && inputKey.length > 5) {
      setApiKey(inputKey);
      
    } else {
      setError("Por favor, insira uma chave de administrador válida.");
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center">
      <div className="bg-input p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">
          Acesso Administrativo
        </h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="apiKey"
              className="block text-foreground text-sm font-semibold mb-2"
            >
              Chave Secreta (API Key)
            </label>
            <input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-foreground leading-tight focus:outline-none focus:ring-2 focus:ring-destructive focus:border-transparent"
              placeholder="Insira sua chave de administrador"
            />
          </div>

          {error && (
            <p className="mt-4 mb-4 text-center text-sm bg-destructive text-destructive-foreground p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 rounded-md shadow-lg text-lg font-semibold text-accent bg-destructive transition-colors duration-200"
          >
            Acessar Painel
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          * Dica: A chave de acesso é configurada no arquivo `.env` do Backend.
          Consulte o **README.md**.
        </p>
      </div>
    </div>
  );
}