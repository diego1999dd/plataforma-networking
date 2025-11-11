import { useEffect, useState } from "react";

export interface AdminAuth {
  apiKey: string;
  setApiKey: (key: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean; 
  clearAuth: () => void;
}

export const useAdminAuth = (): AdminAuth => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const storedKey = localStorage.getItem("adminKey") || "";
    setApiKey(storedKey);
    setIsLoading(false); 
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