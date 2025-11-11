const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ensureTrailingSlash = (url: string) => {
  return url.endsWith("/") ? url : url + "/";
};

export async function apiFetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrlWithSlash = ensureTrailingSlash(API_BASE_URL as string);
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;
  const url = `${baseUrlWithSlash}${cleanEndpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    // For 403, we give a specific message, but authenticatedFetch should handle it.
    if (response.status === 403) {
      throw new Error("Acesso não autorizado.");
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Erro na requisição.");
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export async function authenticatedFetch<T>(
  endpoint: string,
  apiKey: string,
  options?: RequestInit
): Promise<T> {
  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      "x-api-key": apiKey,
    },
  };

  try {
    return await apiFetcher<T>(endpoint, authOptions);
  } catch (error: any) {
    if (error.message.includes("Acesso não autorizado")) {
      throw new Error("Acesso não autorizado. Chave de Admin inválida.");
    }
    throw error;
  }
}
