import { Body, Controller, Delete, Get, HttpCode, HttpException, Inject, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { ApiService, SESSION_COOKIE } from "./api.service";
import { coolifyConfig, coolifyRequest } from "../lib/coolify";
import { installationRepositories, appInstallationInfo } from "../lib/github";

type Session = NonNullable<Awaited<ReturnType<ApiService["getSession"]>>>;
type AuthedRequest = Request & { siriusSession?: Session };
function failure(error: string, status = 400): never { throw new HttpException({ error }, status); }
const cookieToken = (req: Request) => {
  const raw = req.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  if (!raw) return undefined;
  try { return decodeURIComponent(raw.slice(SESSION_COOKIE.length + 1)); } catch { return undefined; }
};
const sessionCookie = (token: string, expiresAt: Date) => `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
const clearCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

@Controller()
export class ApiController {
  constructor(@Inject(ApiService) private readonly api: ApiService) {}

  @Get("health")
  health() { return { status: "ok", service: "sirius-api", framework: "nestjs" }; }

  private async session(req: Request) {
    const session = await this.api.getSession(cookieToken(req));
    if (!session) failure("Autenticação necessária.", 401);
    return session;
  }

  private origin(req: Request) {
    if (!this.api.validMutationOrigin(req)) failure("Origem inválida.", 403);
  }

  @Post("auth/register")
  async register(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() body: unknown) {
    this.origin(req);
    const parsed = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(254), password: z.string().min(10).max(128), organization: z.string().trim().min(2).max(80).optional() }).safeParse(body);
    if (!parsed.success) failure("Verifica os dados. A palavra-passe deve ter pelo menos 10 caracteres.");
    const { name, email, password, organization } = parsed.data;
    const slugBase = (organization || name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "organizacao";
    try {
      const user = await this.api.db.user.create({ data: {
        name, email: email.toLowerCase(), passwordHash: await this.api.hashPassword(password),
        memberships: { create: { role: "OWNER", organization: { create: { name: organization || `${name} — Organização`, slug: `${slugBase}-${crypto.randomUUID().slice(0, 6)}` } } } },
      }, include: { memberships: { include: { organization: true } } } });
      const membership = user.memberships[0];
      const cookie = await this.api.createSession(user.id, membership.organizationId);
      res.setHeader("Set-Cookie", sessionCookie(cookie.token, cookie.expiresAt));
      return { user: { id: user.id, name: user.name, email: user.email }, organization: { id: membership.organization.id, name: membership.organization.name } };
    } catch (cause) {
      if ((cause as { code?: string }).code === "P2002") failure("Já existe uma conta com este e-mail.", 409);
      console.error("signup_failed", cause instanceof Error ? cause.message : "unknown");
      failure("Não foi possível criar a conta.", 500);
    }
  }

  @Post("auth/login")
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() body: unknown) {
    this.origin(req);
    const parsed = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) }).safeParse(body);
    if (!parsed.success) failure("E-mail ou palavra-passe inválidos.");
    const user = await this.api.db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, include: { memberships: { include: { organization: true }, orderBy: { createdAt: "asc" }, take: 1 } } });
    if (!user || !(await this.api.verifyPassword(parsed.data.password, user.passwordHash)) || !user.memberships[0]) failure("E-mail ou palavra-passe inválidos.", 401);
    const membership = user.memberships[0];
    const cookie = await this.api.createSession(user.id, membership.organizationId);
    res.setHeader("Set-Cookie", sessionCookie(cookie.token, cookie.expiresAt));
    return { user: { id: user.id, name: user.name, email: user.email }, organization: { id: membership.organization.id, name: membership.organization.name } };
  }

  @Post("auth/logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.origin(req); await this.api.revokeSession(cookieToken(req)); res.setHeader("Set-Cookie", clearCookie()); return { ok: true };
  }

  @Get("auth/me")
  async me(@Req() req: Request) {
    const session = await this.api.getSession(cookieToken(req));
    if (!session) failure("Autenticação necessária.", 401);
    return { user: session.user, organization: { id: session.organization.id, name: session.organization.name, slug: session.organization.slug } };
  }

  @Get("projects")
  async projects(@Req() req: Request) {
    const session = await this.session(req);
    const projects = await this.api.db.project.findMany({ where: { organizationId: session.organizationId }, orderBy: { createdAt: "desc" }, include: { _count: { select: { applications: true } } } });
    return { projects };
  }

  @Post("projects")
  async createProject(@Req() req: Request, @Body() body: unknown) {
    this.origin(req); const session = await this.session(req);
    const parsed = z.object({ name: z.string().trim().min(2).max(80), description: z.string().trim().max(500).optional() }).safeParse(body);
    if (!parsed.success) failure("Nome do projecto inválido.");
    try {
      const project = await this.api.db.project.create({ data: { ...parsed.data, organizationId: session.organizationId } });
      await this.audit(session, "project.created", "project", project.id); return { project };
    } catch (cause) {
      if ((cause as { code?: string }).code === "P2002") failure("Já existe um projecto com esse nome.", 409);
      failure("Não foi possível criar o projecto.", 500);
    }
  }

  @Patch("projects/:id")
  async updateProject(@Req() req: Request, @Param("id") id: string, @Body() body: unknown) {
    this.origin(req); const session = await this.session(req);
    const parsed = z.object({ name: z.string().trim().min(2).max(80).optional(), description: z.string().trim().max(500).optional(), archived: z.boolean().optional() }).refine((v) => Object.keys(v).length > 0).safeParse(body);
    if (!parsed.success) failure("Alterações inválidas.");
    const data = { ...(parsed.data.name ? { name: parsed.data.name } : {}), ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}), ...(parsed.data.archived !== undefined ? { archivedAt: parsed.data.archived ? new Date() : null } : {}) };
    const result = await this.api.db.project.updateMany({ where: { id, organizationId: session.organizationId }, data });
    if (!result.count) failure("Projecto não encontrado.", 404);
    return { project: await this.api.db.project.findFirst({ where: { id, organizationId: session.organizationId } }) };
  }

  @Delete("projects/:id")
  async deleteProject(@Req() req: Request, @Param("id") id: string) {
    this.origin(req); const session = await this.session(req);
    const project = await this.api.db.project.findFirst({ where: { id, organizationId: session.organizationId }, select: { _count: { select: { applications: true } } } });
    if (!project) failure("Projecto não encontrado.", 404);
    if (project._count.applications) failure("Este projecto ainda contém aplicações. Arquiva-o ou move as aplicações antes de o eliminar.", 409);
    const result = await this.api.db.project.deleteMany({ where: { id, organizationId: session.organizationId } });
    if (!result.count) failure("Projecto não encontrado.", 404); return { ok: true };
  }

  @Get("apps")
  async apps(@Req() req: Request) {
    const session = await this.session(req);
    const applications = await this.api.db.application.findMany({ where: { organizationId: session.organizationId }, select: {
      id: true, projectId: true, name: true, repositoryUrl: true, repositoryPrivate: true, branch: true, enablePreviews: true, state: true, domain: true, lastDeploymentAt: true, createdAt: true,
      project: { select: { id: true, name: true } }, deployments: { orderBy: { createdAt: "desc" }, take: 1, select: { id: true, state: true, branch: true, pullRequestNumber: true, previewUrl: true, createdAt: true } },
    }, orderBy: { createdAt: "desc" } });
    const organization = await this.api.db.organization.findUnique({ where: { id: session.organizationId }, select: { githubInstallationId: true } });
    return { applications, integrations: { githubConfigured: Boolean(process.env.GITHUB_APP_ID && process.env.GITHUB_APP_SLUG && process.env.GITHUB_APP_PRIVATE_KEY), githubInstalled: Boolean(organization?.githubInstallationId), coolifyConfigured: Boolean(process.env.COOLIFY_BASE_URL && process.env.COOLIFY_API_TOKEN && process.env.COOLIFY_PROJECT_UUID && process.env.COOLIFY_SERVER_UUID) } };
  }

  @Post("apps")
  async createApp(@Req() req: Request, @Body() body: unknown) {
    this.origin(req); const session = await this.session(req);
    const parsed = z.object({ name: z.string().trim().min(2).max(80), repositoryUrl: z.string().url().max(300), branch: z.string().trim().min(1).max(120).optional(), projectId: z.string().optional(), buildPack: z.enum(["nixpacks", "dockerfile", "static"]).default("nixpacks"), enablePreviews: z.boolean().default(true) }).safeParse(body);
    if (!parsed.success) failure("Dados da aplicação inválidos.");
    let repository: { owner: string; name: string };
    try { const url = new URL(parsed.data.repositoryUrl); const parts = url.pathname.split("/").filter(Boolean); if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || parts.length < 2) failure("Indica um repositório válido do GitHub."); repository = { owner: parts[0], name: parts[1].replace(/\.git$/, "") }; }
    catch { failure("Indica um repositório válido do GitHub."); }
    const organization = await this.api.db.organization.findUnique({ where: { id: session.organizationId }, select: { githubInstallationId: true } });
    if (!organization?.githubInstallationId) failure("Liga primeiro a GitHub App à organização.", 409);
    let repoInfo;
    try { repoInfo = (await installationRepositories(organization.githubInstallationId)).find((item) => item.full_name.toLowerCase() === `${repository.owner}/${repository.name}`.toLowerCase()); }
    catch { failure("Não foi possível validar o acesso do GitHub à organização.", 502); }
    if (!repoInfo) failure("Este repositório não foi autorizado na instalação da GitHub App.", 403);
    if (parsed.data.projectId && !await this.api.db.project.findFirst({ where: { id: parsed.data.projectId, organizationId: session.organizationId } })) failure("Projecto não encontrado.", 404);
    try {
      const application = await this.api.db.application.create({ data: { ...parsed.data, repositoryOwner: repository.owner, repositoryName: repository.name, repositoryPrivate: repoInfo.private, branch: parsed.data.branch || repoInfo.default_branch, organizationId: session.organizationId } });
      await this.audit(session, "application.created", "application", application.id); return { application };
    } catch (cause) { if ((cause as { code?: string }).code === "P2002") failure("Já existe uma aplicação com esse nome.", 409); failure("Não foi possível criar a aplicação.", 500); }
  }

  @Post("apps/:id/deploy")
  @HttpCode(202)
  async deploy(@Req() req: Request, @Param("id") id: string) {
    this.origin(req); const session = await this.session(req);
    const app = await this.api.db.application.findFirst({ where: { id, organizationId: session.organizationId } });
    if (!app) failure("Aplicação não encontrada.", 404);
    if (!coolifyConfig()) failure("Integração Coolify por configurar. O deploy não foi iniciado.", 503);
    if (app.repositoryPrivate && !process.env.COOLIFY_GITHUB_APP_UUID) failure("O Coolify precisa de uma GitHub App instalada para repositórios privados. O deploy não foi iniciado.", 503);
    const deployment = await this.api.db.deployment.create({ data: { applicationId: app.id, branch: app.branch, state: "QUEUED" } });
    try {
      let uuid = app.coolifyUuid;
      let fqdn = app.domain;
      if (!uuid) {
        const path = app.repositoryPrivate ? "/applications/private-github-app" : "/applications/public";
        const payload = {
          project_uuid: process.env.COOLIFY_PROJECT_UUID,
          server_uuid: process.env.COOLIFY_SERVER_UUID,
          ...(process.env.COOLIFY_GITHUB_APP_UUID ? { github_app_uuid: process.env.COOLIFY_GITHUB_APP_UUID } : {}),
          git_repository: `${app.repositoryOwner}/${app.repositoryName}`,
          git_branch: app.branch,
          build_pack: app.buildPack,
          name: app.name,
          is_preview_deployments_enabled: app.enablePreviews,
          instant_deploy: false,
        };
        const created = await coolifyRequest<{ uuid?: string; fqdn?: string }>(path, { method: "POST", body: JSON.stringify(payload) });
        if (!created.uuid) throw new Error("coolify_missing_application_uuid");
        uuid = created.uuid; fqdn = created.fqdn ?? null;
        await this.api.db.application.update({ where: { id: app.id }, data: { coolifyUuid: uuid, domain: fqdn, state: "DEPLOYING" } });
      }
      await coolifyRequest(`/applications/${encodeURIComponent(uuid)}/start`, { method: "POST", body: JSON.stringify({}) });
      await this.api.db.deployment.update({ where: { id: deployment.id }, data: { state: "BUILDING", deploymentUuid: uuid } });
      await this.api.db.application.update({ where: { id: app.id }, data: { state: "DEPLOYING", lastDeploymentAt: new Date() } });
      await this.audit(session, "application.deploy_queued", "application", app.id);
      return { deployment: { id: deployment.id, state: "BUILDING" }, message: "Deploy enviado ao Coolify.", simulated: false };
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "coolify_request_failed";
      await this.api.db.deployment.update({ where: { id: deployment.id }, data: { state: "FAILED", errorCode: code.slice(0, 80) } });
      await this.api.db.application.update({ where: { id: app.id }, data: { state: "FAILED" } });
      console.error("coolify_deploy_failed", code);
      failure("O Coolify não aceitou o deploy.", 502);
    }
  }

  @Post("apps/:id/preview")
  @HttpCode(202)
  async preview(@Req() req: Request, @Param("id") id: string, @Body() body: unknown) {
    this.origin(req); const session = await this.session(req);
    const parsed = z.object({ pullRequest: z.number().int().positive().max(999999) }).safeParse(body);
    if (!parsed.success) failure("Número do pull request inválido.");
    const app = await this.api.db.application.findFirst({ where: { id, organizationId: session.organizationId } });
    if (!app) failure("Aplicação não encontrada.", 404);
    if (!app?.coolifyUuid || !app.enablePreviews) failure("Aplicação sem previews configurados.", 409);
    if (!coolifyConfig()) failure("Integração Coolify por configurar.", 503);
    const deployment = await this.api.db.deployment.create({ data: { applicationId: app.id, branch: app.branch, pullRequestNumber: parsed.data.pullRequest } });
    try {
      await coolifyRequest(`/deploy?uuid=${encodeURIComponent(app.coolifyUuid)}&pr=${parsed.data.pullRequest}`, { method: "POST" });
      await this.api.db.deployment.update({ where: { id: deployment.id }, data: { state: "BUILDING", deploymentUuid: app.coolifyUuid } });
      return { deployment: { id: deployment.id, state: "BUILDING" }, simulated: false };
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "coolify_request_failed";
      await this.api.db.deployment.update({ where: { id: deployment.id }, data: { state: "FAILED", errorCode: code.slice(0, 80) } });
      failure("Não foi possível criar o preview.", 502);
    }
  }

  @Get("invoices")
  async invoices(@Req() req: Request) {
    const session = await this.session(req);
    const invoices = await this.api.db.invoice.findMany({ where: { organizationId: session.organizationId }, include: { attempts: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" } });
    return { invoices, paymentsConfigured: false, paymentProvider: "not_configured" };
  }

  @Post("invoices")
  async createInvoice(@Req() req: Request, @Body() body: unknown) {
    this.origin(req); const session = await this.session(req);
    const parsed = z.object({ description: z.string().trim().min(3).max(200), amountKz: z.number().int().positive().max(2_000_000_000), dueAt: z.string().datetime().optional() }).safeParse(body);
    if (!parsed.success) failure("Dados da factura inválidos.");
    const number = `SC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const invoice = await this.api.db.invoice.create({ data: { organizationId: session.organizationId, number, description: parsed.data.description, amountKz: parsed.data.amountKz, state: "DRAFT", dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null } });
    await this.audit(session, "invoice.created", "invoice", invoice.id); return { invoice };
  }

  @Post("invoices/:id/checkout")
  async checkout(@Req() req: Request, @Param("id") id: string) {
    this.origin(req); const session = await this.session(req);
    const invoice = await this.api.db.invoice.findFirst({ where: { id, organizationId: session.organizationId, state: "PENDING" } });
    if (!invoice) failure("Factura não encontrada.", 404);
    failure("O fornecedor de pagamentos ainda não está configurado. Nenhuma cobrança foi criada.", 503);
  }

  @Get("integrations/github/install")
  async githubInstall(@Req() req: Request, @Res() res: Response) {
    const session = await this.api.getSession(cookieToken(req));
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    if (!session) return res.redirect(`${appUrl}/login`);
    const slug = process.env.GITHUB_APP_SLUG;
    const secret = process.env.AUTH_SECRET;
    if (!slug || !secret || secret.length < 32) return res.status(503).json({ error: "A GitHub App ainda não está configurada." });
    const nonce = crypto.randomUUID();
    const state = await new SignJWT({ organizationId: session.organizationId, nonce })
      .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("10m").sign(new TextEncoder().encode(secret));
    res.cookie("sirius_github_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600_000 });
    const url = new URL(`https://github.com/apps/${encodeURIComponent(slug)}/installations/new`);
    url.searchParams.set("state", nonce);
    return res.redirect(url.toString());
  }

  @Get("integrations/github/callback")
  async githubCallback(@Req() req: Request, @Res() res: Response, @Query("installation_id") installationId?: string, @Query("state") stateParam?: string) {
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const session = await this.api.getSession(cookieToken(req));
    const signedState = cookieTokenByName(req, "sirius_github_state");
    res.clearCookie("sirius_github_state", { path: "/" });
    if (!session || !stateParam || !installationId || !signedState || !process.env.AUTH_SECRET) return res.redirect(`${appUrl}/dashboard/apps?github=invalid`);
    try {
      const verified = await jwtVerify(signedState, new TextEncoder().encode(process.env.AUTH_SECRET));
      if (verified.payload.nonce !== stateParam || verified.payload.organizationId !== session.organizationId || !/^\d+$/.test(installationId)) throw new Error("invalid_github_state");
      const info = await appInstallationInfo(installationId);
      await this.api.db.organization.update({ where: { id: session.organizationId }, data: { githubInstallationId: String(info.id) } });
      await this.audit(session, "github_app.installed", "organization", session.organizationId);
      return res.redirect(`${appUrl}/dashboard/apps?github=connected`);
    } catch { return res.redirect(`${appUrl}/dashboard/apps?github=failed`); }
  }

  @Get("integrations/github/repositories")
  async githubRepositories(@Req() req: Request) {
    const session = await this.session(req);
    const org = await this.api.db.organization.findUnique({ where: { id: session.organizationId }, select: { githubInstallationId: true } });
    if (!org?.githubInstallationId) failure("Liga a GitHub App à organização primeiro.", 409);
    try {
      const repositories = await installationRepositories(org.githubInstallationId);
      return { repositories: repositories.map(({ id, name, full_name, private: isPrivate, default_branch, html_url }) => ({ id, name, fullName: full_name, private: isPrivate, defaultBranch: default_branch, url: html_url })) };
    } catch { failure("Não foi possível consultar os repositórios autorizados.", 502); }
  }

  private async audit(session: Session, action: string, resourceType: string, resourceId: string) {
    await this.api.db.auditLog.create({ data: { organizationId: session.organizationId, actorId: session.userId, action, resourceType, resourceId } });
  }
}

function cookieTokenByName(req: Request, name: string) {
  const raw = req.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  if (!raw) return undefined;
  try { return decodeURIComponent(raw.slice(name.length + 1)); } catch { return undefined; }
}
