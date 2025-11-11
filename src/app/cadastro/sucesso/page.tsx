// src/app/cadastro/sucesso/page.tsx

"use client";

import Link from "next/link";

export default function CadastroSucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
        <div className="text-6xl text-green-500 mb-6">
          {/* Símbolo de sucesso ou um emoji */}
          🎉
        </div>
        <h1 className="text-3xl font-extrabold mb-4 text-gray-800">
          Cadastro Concluído com Sucesso!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Parabéns! Sua conta de membro ativo foi criada.
        </p>

        {/* Botão para a próxima ação lógica */}
        <Link href="/" passHref>
          <div className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 cursor-pointer">
            Voltar para a Home (e Futuro Login)
          </div>
        </Link>
      </div>
    </div>
  );
}
