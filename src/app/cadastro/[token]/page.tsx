// src/app/cadastro/[token]/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetcher } from "../../../lib/apiFetcher";
import InputField from "../../../components/ui/InputField";

// O DTO do seu backend (CompletarCadastroDto)
interface CompletarCadastroPayload {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  senha: string;
}

interface ValidarConviteResponse {
  candidatura: {
    nome: string;
    email: string;
    empresa: string;
  };
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
    cargo: "",
    senha: "",
  });

  // 1. Hook para buscar os dados iniciais do convite
  const fetchConviteData = useCallback(async () => {
    if (!token) {
      setError("Token de convite não encontrado.");
      setLoading(false);
      return;
    }

    try {
      // Endpoint para buscar o convite e validar o token
      const data = await apiFetcher<ValidarConviteResponse>(
        `convites/validar/${token}`
      );

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

    try {
      // Endpoint de cadastro completo no seu NestJS
      await apiFetcher(`convites/completar/${token}`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Sucesso: Redireciona para uma página de sucesso ou login
      alert("Cadastro concluído com sucesso! Você já é um membro ativo.");
      router.push("/"); // Ou para a página de login
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
        <p className="text-gray-500">Carregando convite...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Finalizar Cadastro de Membro
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Campo Nome (Pré-preenchido e desabilitado) */}
          <InputField
            label="Nome Completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            type="text"
            disabled={true}
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
          />

          {/* Campo Cargo */}
          <InputField
            label="Seu Cargo na Empresa"
            name="cargo"
            value={form.cargo}
            onChange={handleChange}
            placeholder="Ex: CEO, Gerente de Vendas"
            type="text"
            required
          />

          {/* Campo Senha */}
          <InputField
            label="Defina sua Senha"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            type="password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? "Finalizando..." : "Concluir Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}
