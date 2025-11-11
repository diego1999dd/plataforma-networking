"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import InputField from "../../../components/ui/InputField";
import { apiFetcher } from "../../../lib/apiFetcher";

// O DTO do seu backend (CompletarCadastroDto)
interface CompletarCadastroPayload {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  funcao: string;
}

interface CandidaturaData {
  nome: string;
  email: string;
  empresa: string;
}

interface ConviteResponse {
  // Outros campos do Convite (id, token, isUsado...)
  candidatura: CandidaturaData; // O objeto que contém nome e email
}

export default function CadastroCompletoPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CompletarCadastroPayload>({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    funcao: "",
  });

  const isUUID = (str: string) => {
    // Verifica o formato básico do UUID
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      str
    );
  };

  // 1. Hook para buscar os dados iniciais do convite
  const fetchConviteData = useCallback(async () => {
    if (!token || token === "token" || !isUUID(token)) {
      setError("Token de convite não encontrado.");
      setLoading(false);
      return;
    }

    try {
      // Endpoint para buscar o convite e validar o token
      const data = await apiFetcher<ConviteResponse>(`convites/${token}`);

      // Pré-preenchemos com dados da candidatura aprovada
      setForm({
        ...form,
        nome: data.candidatura.nome,
        email: data.candidatura.email,
        empresa: data.candidatura.empresa,
        // O restante dos campos serão preenchidos pelo usuário
      });
      setLoading(false);
    } catch (err: any) {
      setError("Convite inválido ou expirado.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConviteData();
  }, [fetchConviteData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Função para submeter o cadastro completo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🛑 VERIFICAÇÃO DE NOVO AQUI ANTES DE CHAMAR O BACKEND
    if (!token || token === "token" || !isUUID(token)) {
      setError(
        "Token de convite inválido ou ausente. Não é possível finalizar o cadastro."
      );
      setLoading(false);
      return;
    }

    try {
      // Endpoint de cadastro completo no seu NestJS
      await apiFetcher(`convites/${token}/completar/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Sucesso: Redireciona para uma página de sucesso ou login
      alert("Cadastro concluído com sucesso! Você já é um membro ativo.");
      router.push("/cadastro/sucesso"); // Ou para a página de login
    } catch (err: any) {
      setError(
        err.message || "Erro ao finalizar cadastro. Verifique os dados."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted">Carregando convite...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-input rounded-xl shadow-lg">
        <h1 className="text-center text-3xl font-extrabold text-black">
          Finalizar Cadastro de Membro
        </h1>
        {error && (
          <div className="bg-destructive border border-destructive text-destructive-foreground px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6 text-black" onSubmit={handleSubmit}>
          {/* Campo Nome (Pré-preenchido e desabilitado) */}
          <InputField
            label="Nome Completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            type="text"
            disabled={true}
            className="placeholder:text-black"
          />

          {/* Campo Email (Pré-preenchido e desabilitado) */}
          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu.email@empresa.com"
            type="email"
            disabled={true}
            className="placeholder:text-black"
          />

          {/* Campo Empresa (ADICIONADO - Pré-preenchido e desabilitado) */}
          <InputField
            label="Empresa (Aprovada)"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            placeholder="Nome da empresa"
            type="text"
            disabled={true}
            className="placeholder:text-black"
          />

          {/* Campo Telefone */}
          <InputField
            label="Telefone (com DDD)"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(xx) xxxxx-xxxx"
            type="tel"
            required
            className="placeholder:text-muted border-2 rounded-xl border-black p-2"
          />

          {/* Campo Cargo */}
          <InputField
            label="Seu Cargo na Empresa"
            name="funcao"
            value={form.funcao}
            onChange={handleChange}
            placeholder="Ex: CEO, Gerente de Vendas"
            type="text"
            required
            className="placeholder:text-muted border-2 rounded-xl border-black p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? "Finalizando..." : "Concluir Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}
