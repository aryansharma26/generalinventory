const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:4000";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
