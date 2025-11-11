// frontend/src/hooks/useAdminAuth.ts

import { useEffect, useState } from "react";

export interface AdminAuth {
  apiKey: string;
  setApiKey: (key: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Estado para sincronizar a leitura do localStorage
  clearAuth: () => void;
}

export const useAdminAuth = (): AdminAuth => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Apenas executa no CLIENTE (após a hidratação):
    const storedKey = localStorage.getItem("adminKey") || "";
    setApiKey(storedKey);
    setIsLoading(false); // Marca o carregamento como concluído
  }, []);

  const setKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminKey", key);
    }
  };

  const clearAuth = () => {
    setApiKey("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminKey");
    }
  };

  return {
    apiKey,
    setApiKey: setKey,
    isAuthenticated: !!apiKey,
    isLoading,
    clearAuth,
  };
};
