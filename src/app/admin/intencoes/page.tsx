"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import { authenticatedFetch } from "../../../lib/apiFetcher";


interface Candidatura {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  motivoParticipacao: string;
  status: "PENDENTE" | "APROVADA" | "RECUSADA";
  dataCriacao: string;
}

export default function AdminIntencoesPage() {
  const router = useRouter();
  const {
    apiKey,
    isAuthenticated,
    clearAuth,
    isLoading: isLoadingHook,
  } = useAdminAuth();

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState("");

  const fetchCandidaturas = useCallback(async () => {
    if (!apiKey) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    setError("");

    try {
      const data = await authenticatedFetch<Candidatura[]>(
        "/admin/candidaturas",
        apiKey,
        { method: "GET" }
      );
      setCandidaturas(data);
    } catch (err: any) {
      if (err.message.includes("Acesso não autorizado")) {
        clearAuth();
        router.replace("/admin");
        return;
      }
      setError(err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, [apiKey, router, clearAuth]);

  useEffect(() => {
    if (!isLoadingHook && !isAuthenticated) {
      router.replace("/admin");
      return;
    }

    if (!isLoadingHook && isAuthenticated && isLoadingData) {
      fetchCandidaturas();
    }
  }, [
    isAuthenticated,
    router,
    isLoadingHook,
    isLoadingData,
    fetchCandidaturas,
  ]);

  const handleAction = async (id: number, action: "aprovar" | "recusar") => {
    if (
      !confirm(
        `Tem certeza que deseja ${
          action === "aprovar" ? "APROVAR" : "RECUSAR"
        } a candidatura ID ${id}?`
      )
    )
      return;

    try {
      await authenticatedFetch(`/admin/candidaturas/${id}/${action}`, apiKey, {
        method: "POST",
      });

      alert(
        `Candidatura ${id} ${
          action === "aprovar" ? "APROVADA" : "RECUSADA"
        } com sucesso!`
      );

      fetchCandidaturas();
    } catch (err: any) {
      alert(`Falha na ação: ${err.message}`);
    }
  };

  if (isLoadingHook || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Carregando candidaturas...
      </div>
    );
  }

  if (error) {
    return (
      
      <div className="p-8 text-center bg-danger-light border border-danger-light rounded-lg m-10">
        <h2 className="text-xl font-semibold text-danger">Erro:</h2>
        <p className="text-danger">{error}</p>
        <button
          onClick={fetchCandidaturas}
          className="mt-4 text-primary hover:underline"
        >
          Tentar Novamente
        </button>
        <button
          onClick={clearAuth}
          className="mt-4 ml-4 text-danger hover:underline"
        >
          Trocar Chave
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 ">
      
      <h1 className="text-3xl font-extrabold mb-6 text-primary2">
        Gestão de Candidaturas ({candidaturas.length})
      </h1>
      {candidaturas.length === 0 ? (
        <p className="text-muted">Nenhuma candidatura encontrada.</p>
      ) : (
        
        <div className="overflow-x-auto bg-accent shadow-lg rounded-lg">
          
          <table className="min-w-full divide-y divide-muted">
            
            <thead className="bg-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  ID / Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Empresa / Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>

            
            <tbody className="bg-accent divide-y divide-muted2">
              {candidaturas.map((candidato) => (
                <tr
                  key={candidato.id}
                  className={
                    
                    candidato.status === "PENDENTE" ? "bg-bg" : "bg-accent"
                  }
                >
                  <td className="px-6 py-4 accentspace-nowrap text-sm text-muted2">
                    <span className="font-bold text-black">{candidato.id}</span>
                    <br />
                    {new Date(candidato.dataCriacao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </td>
                  <td className="px-6 py-4 accentspace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {candidato.nome}
                    </div>
                    <div className="text-sm text-muted2">{candidato.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted2 max-w-xs truncate">
                    <span className="font-medium text-black">
                      {candidato.empresa}
                    </span>
                    <br />
                    <span title={candidato.motivoParticipacao}>
                      {candidato.motivoParticipacao?.substring(0, 50)}...
                    </span>
                  </td>
                  <td className="px-6 py-4 accentspace-nowrap">
                    
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        candidato.status === "APROVADA"
                          ? "bg-light text-success" 
                          : candidato.status === "RECUSADA"
                          ? "bg-danger-light text-danger" 
                          : 
                            "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {candidato.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 accentspace-nowrap text-sm font-medium">
                    {candidato.status === "PENDENTE" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAction(candidato.id, "aprovar")}
                          className="text-sucesss hover:opacity-75 font-semibold text-sm cursor-pointer"
                        >
                          APROVAR
                        </button>
                        <button
                          onClick={() => handleAction(candidato.id, "recusar")}
                          className="text-danger hover:opacity-75 font-semibold text-sm cursor-pointer"
                        >
                          RECUSAR
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}{" "}
    </div>
  );
}