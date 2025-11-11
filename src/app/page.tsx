import Link from "next/link";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center p-8  bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <h1 className="text-5xl font-extrabold mb-8 text-accent">
        Plataforma de Networking
      </h1>
      <p className="text-xl text-accent mb-12 text-center max-w-lg">
        Bem-vindo! Selecione sua função para começar a interagir com o sistema.
      </p>

      <div className="container mx-auto items-center justify-center flex flex-col space-y-6 sm:flex-row sm:space-x-8 sm:space-y-0 ">
        
        <Link
          href="/candidatar"
          className="bg-primary hover:bg-accent text-accent font-bold py-4 px-8 rounded-full shadow-lg text-center transition-colors duration-200 cursor-pointer w-full sm:w-auto !no-underline "
        >
          Quero me Candidatar
        </Link>

        
        <Link
          href="/admin"
          className="bg-danger text-accent font-bold py-4 px-8 rounded-full shadow-lg text-center transition-colors duration-200 cursor-pointer w-full sm:w-auto !no-underline "
        >
          Acesso para Administradores
        </Link>
      </div>

      <p className="mt-12 text-sm text-accent text-center">
        Acesso de Membros Aprovados é feito através do link de convite.
      </p>
    </div>
  );
}