// frontend/src/hooks/useAdminAuth.ts

import { useState } from "react";

export interface AdminAuth {
  apiKey: string;
  setApiKey: (key: string) => void;
  isAuthenticated: boolean;
  clearAuth: () => void;
}

export const useAdminAuth = (): AdminAuth => {
  const [apiKey, setApiKey] = useState(
    // Pega a chave do localStorage (persistência)
    typeof window !== "undefined" ? localStorage.getItem("adminKey") || "" : ""
  );

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
    clearAuth,
  };
};
