// frontend/src/app/admin/intencoes/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import { authenticatedFetch } from "../../../lib/apiFetcher";

// Definição dos tipos de dados (Mantido inalterado)
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
  const router = useRouter(); // Renomeamos isLoading do hook para evitar confusão com isLoadingData
  const {
    apiKey,
    isAuthenticated,
    clearAuth,
    isLoading: isLoadingHook,
  } = useAdminAuth();

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // Carregamento da requisição de dados
  const [error, setError] = useState(""); // Função para buscar os dados (GET /admin/candidaturas)

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
        // 🛑 PONTO CRÍTICO: Limpa a chave, usa replace e SAI imediatamente
        clearAuth();
        router.replace("/admin");
        return;
      }
      setError(err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, [apiKey, router, clearAuth]); // Efeito para proteção de rota e carregar dados

  useEffect(() => {
    // 1. Redirecionamento de proteção (se o hook já leu o localStorage E não está autenticado)
    if (!isLoadingHook && !isAuthenticated) {
      router.replace("/admin");
      return; // << SAÍDA IMEDIATA DO USEEFFECT
    }

    // 2. Busca de dados (só se autenticado E a leitura do localStorage terminou)
    if (!isLoadingHook && isAuthenticated && isLoadingData) {
      fetchCandidaturas();
    }
  }, [
    isAuthenticated,
    router,
    isLoadingHook,
    isLoadingData,
    fetchCandidaturas,
  ]); // Função de Ação (POST /aprovar ou /recusar) - Mantido inalterado

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
  }; // RENDERIZAÇÃO: Mostrar carregando se o hook ou os dados estiverem em trânsito

  if (isLoadingHook || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
                Carregando candidaturas...      {" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-700 bg-red-100 border-red-500 border rounded-lg m-10">
                <h2 className="text-xl font-semibold">Erro:</h2>       {" "}
        <p>{error}</p>       {" "}
        <button
          onClick={fetchCandidaturas}
          className="mt-4 text-blue-500 hover:underline"
        >
                    Tentar Novamente        {" "}
        </button>
               {" "}
        <button
          onClick={clearAuth}
          className="mt-4 ml-4 text-red-500 hover:underline"
        >
                    Trocar Chave        {" "}
        </button>
             {" "}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
           {" "}
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">
                Gestão de Candidaturas ({candidaturas.length})      {" "}
      </h1>
           {" "}
      {candidaturas.length === 0 ? (
        <p className="text-gray-600">Nenhuma candidatura encontrada.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa / Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidaturas.map((candidato) => (
                <tr
                  key={candidato.id}
                  className={
                    candidato.status === "PENDENTE" ? "bg-yellow-50" : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-bold">{candidato.id}</span>
                    <br />
                    {new Date(candidato.dataCriacao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {candidato.nome}
                    </div>
                    <div className="text-sm text-gray-500">
                      {candidato.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    <span className="font-medium">{candidato.empresa}</span>
                    <br />
                    <span title={candidato.motivoParticipacao}>
                      {candidato.motivoParticipacao?.substring(0, 50)}...
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        candidato.status === "APROVADA"
                          ? "bg-green-100 text-green-800"
                          : candidato.status === "RECUSADA"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {candidato.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {candidato.status === "PENDENTE" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAction(candidato.id, "aprovar")}
                          className="text-green-600 hover:text-green-900 font-semibold text-sm"
                        >
                          APROVAR
                        </button>
                        <button
                          onClick={() => handleAction(candidato.id, "recusar")}
                          className="text-red-600 hover:text-red-900 font-semibold text-sm"
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
      )}
         {" "}
    </div>
  );
}
