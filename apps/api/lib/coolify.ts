export function coolifyConfig() {
  const base = process.env.COOLIFY_BASE_URL?.replace(/\/$/, "");
  const token = process.env.COOLIFY_API_TOKEN;
  if (!base || !token || !process.env.COOLIFY_PROJECT_UUID || !process.env.COOLIFY_SERVER_UUID) return null;
  return { base, token };
}

export async function coolifyRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = coolifyConfig();
  if (!config) throw new Error("coolify_not_configured");
  const response = await fetch(`${config.base}/api/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${config.token}`, Accept: "application/json", "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`coolify_http_${response.status}`);
  return response.json() as Promise<T>;
}
