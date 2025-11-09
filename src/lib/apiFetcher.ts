// frontend/src/lib/apiFetcher.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function authenticatedFetch<T>(
  endpoint: string,
  apiKey: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    "x-api-key": apiKey, // A chave secreta para autenticação Admin
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (response.status === 403) {
    throw new Error("Acesso não autorizado. Chave de Admin inválida.");
  }

  if (!response.ok) {
    const errorData = await response.json();
    // Exibe erros de validação do NestJS ou mensagens de BadRequest
    throw new Error(errorData.message || "Erro na requisição.");
  }

  return response.json() as Promise<T>;
}
