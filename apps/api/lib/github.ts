import { importPKCS8, SignJWT } from "jose";

export async function appJwt() {
  const id = process.env.GITHUB_APP_ID;
  const pem = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!id || !pem) throw new Error("github_app_not_configured");
  const key = await importPKCS8(pem, "RS256");
  return new SignJWT({}).setProtectedHeader({ alg: "RS256", typ: "JWT" }).setIssuedAt(Math.floor(Date.now() / 1000) - 60).setIssuer(id).setExpirationTime("9m").sign(key);
}

export async function appInstallationInfo(installationId: string) {
  const jwt = await appJwt();
  const response = await fetch(`https://api.github.com/app/installations/${encodeURIComponent(installationId)}`, { headers: { Authorization: `Bearer ${jwt}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, cache: "no-store" });
  if (!response.ok) throw new Error(`github_http_${response.status}`);
  return response.json() as Promise<{ id: number; account: { login: string } }>;
}

export async function installationToken(installationId: string) {
  const jwt = await appJwt();
  const response = await fetch(`https://api.github.com/app/installations/${encodeURIComponent(installationId)}/access_tokens`, {
    method: "POST", headers: { Authorization: `Bearer ${jwt}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
    body: JSON.stringify({}), cache: "no-store",
  });
  if (!response.ok) throw new Error(`github_http_${response.status}`);
  const data = await response.json() as { token: string; expires_at: string };
  return data;
}

export type GitHubRepository = { id: number; name: string; full_name: string; private: boolean; default_branch: string; html_url: string };
export async function installationRepositories(installationId: string) {
  const { token } = await installationToken(installationId);
  const all: GitHubRepository[] = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetch(`https://api.github.com/installation/repositories?per_page=100&page=${page}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, cache: "no-store",
    });
    if (!response.ok) throw new Error(`github_http_${response.status}`);
    const data = await response.json() as { repositories: GitHubRepository[] };
    all.push(...data.repositories);
    if (data.repositories.length < 100) break;
  }
  return all;
}
