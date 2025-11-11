"use client";

import Link from "next/link";

export default function CadastroSucessoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center p-8  bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className=" p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
        <div className="text-6xl mb-6">
          
          🎉
        </div>
        <h1 className="text-3xl font-extrabold mb-4 text-accent">
          Cadastro Concluído com Sucesso!
        </h1>
        <p className="text-lg text-accent mb-8">
          Parabéns! Sua conta de membro ativo foi criada.
        </p>

        
        <Link href="/" passHref>
          <div className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-black bg-primary transition-colors duration-200 cursor-pointer">
            Voltar para a Home (e Futuro Login)
          </div>
        </Link>
      </div>
    </div>
  );
}