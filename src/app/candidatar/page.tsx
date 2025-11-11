"use client"; // Componente de Cliente para usar hooks e interatividade

import { useState } from "react";

// Componente Básico de Input (Reutilizável)
const InputField = ({
  label,
  id,
  ...props
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: any) => void;
  required: boolean;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium">
      {label}
    </label>
    <input
      id={id}
      className="mt-1 block w-full rounded-md border border-muted p-3 shadow-sm"
      {...props}
    />
  </div>
);

export default function CandidatarPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    motivoParticipacao: "",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Enviando...");

    try {
      // Chamada ao Backend (Usando a variável de ambiente)
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetch(`${apiUrl}/candidaturas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Verifica se o status é 200-299 (incluindo o 201 Created)
        setStatus(
          "✅ Candidatura enviada com sucesso! Você será notificado(a) por e-mail."
        );
        setFormData({
          nome: "",
          email: "",
          empresa: "",
          motivoParticipacao: "",
        });
      } else {
        // Trata erros de validação do NestJS (class-validator)
        const errorMsg = data.message
          ? Array.isArray(data.message)
            ? data.message.join("; ")
            : data.message
          : "Erro desconhecido.";
        setStatus(`❌ Falha na validação: ${errorMsg}`);
      }
    } catch (error) {
      setStatus(
        "❌ Erro de conexão com o servidor. Verifique se o backend está ativo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center pt-12">
      <div className="bg-accent p-10 rounded-xl shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-primary">
          Intenção de Participação
        </h1>
        <p className="text-center text-muted mb-8">
          Preencha seus dados para solicitar entrada no grupo de networking.
        </p>

        <form onSubmit={handleSubmit} className="text-black">
          <InputField
            label="Nome Completo"
            id="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <InputField
            label="E-mail"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            label="Empresa"
            id="empresa"
            type="text"
            value={formData.empresa}
            onChange={handleChange}
            required
          />

          <div className="mb-6">
            <label
              htmlFor="motivoParticipacao"
              className="block text-sm font-medium"
            >
              Por que você quer participar?
            </label>
            <textarea
              id="motivoParticipacao"
              rows={4}
              className="mt-1 block w-full rounded-md border  p-3 shadow-sm"
              value={formData.motivoParticipacao}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`cursor-pointer w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white transition-all duration-200 ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-primary focus:outline-none focus:ring-4 focus:ring-accent2 focus:ring-opacity-50"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Enviando Solicitação..." : "Enviar Candidatura"}
          </button>
        </form>

        {status && (
          <p
            className={`mt-6 p-3 rounded-md text-center font-medium ${
              status.startsWith("✅")
                ? "bg-light text-success"
                : "bg-danger-light text-danger"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
