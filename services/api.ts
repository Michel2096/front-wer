import axios, { AxiosInstance } from "axios";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS, DEFAULT_API_HOST, DEFAULT_API_PORT } from "@/constants/config";

/**
 * Cliente HTTP para la API Flask.
 *
 * La API usa sesiones tradicionales de Flask (cookie `session`), no JWT.
 * React Native no persiste automáticamente las cookies como un navegador,
 * así que este cliente captura manualmente el header `Set-Cookie` de cada
 * respuesta y lo reenvía como header `Cookie` en cada petición posterior.
 */

let sessionCookie: string | null = null;

async function resolveBaseUrl(): Promise<string> {
  const stored = await storage.get(STORAGE_KEYS.API_BASE_URL);
  return stored || `http://${DEFAULT_API_HOST}:${DEFAULT_API_PORT}`;
}

export async function getBaseUrl(): Promise<string> {
  return resolveBaseUrl();
}

// React Native no comparte cookies entre el cliente HTTP y el socket, así
// que el socket necesita esta cookie explícitamente (ver services/socket.ts).
export function getSessionCookie(): string | null {
  return sessionCookie;
}

export async function setBaseUrl(host: string, port: string): Promise<void> {
  await storage.set(STORAGE_KEYS.API_BASE_URL, `http://${host}:${port}`);
}

export function clearSession(): void {
  sessionCookie = null;
}

const client: AxiosInstance = axios.create({
  timeout: 15000,
  withCredentials: true,
});

client.interceptors.request.use(async (config) => {
  config.baseURL = await resolveBaseUrl();
  if (sessionCookie) {
    config.headers = config.headers ?? {};
    config.headers["Cookie"] = sessionCookie;
  }
  config.headers = config.headers ?? {};
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept"] = "application/json";
  return config;
});

client.interceptors.response.use(
  (response) => {
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const raw = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie;
      sessionCookie = raw.split(";")[0];
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return "Ocurrió un error inesperado. Verifica tu conexión con el servidor.";
}

export default client;
