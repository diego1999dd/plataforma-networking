// src/app/page.tsx (A Nova Página Inicial)

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">
        Plataforma de Networking
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-lg">
        Bem-vindo! Selecione sua função para começar a interagir com o sistema.
      </p>

      <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-8 sm:space-y-0">
        {/* Link para o Fluxo Público */}
        <Link href="/candidatar" passHref>
          <div className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-center transition-colors duration-200 cursor-pointer w-full sm:w-auto">
            Quero me Candidatar
          </div>
        </Link>

        {/* Link para o Fluxo Admin */}
        <Link href="/admin" passHref>
          <div className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-center transition-colors duration-200 cursor-pointer w-full sm:w-auto">
            Acesso para Administradores
          </div>
        </Link>
      </div>

      <p className="mt-12 text-sm text-gray-500 text-center">
        Acesso de Membros Aprovados é feito através do link de convite.
      </p>
    </div>
  );
}
