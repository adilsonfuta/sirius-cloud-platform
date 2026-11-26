import { Inject, Injectable } from "@nestjs/common";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { PrismaService } from "./prisma.service";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "sirius_session";
const SESSION_DAYS = 7;
const digest = (token: string) => createHash("sha256").update(token).digest("hex");

@Injectable()
export class ApiService {
  constructor(@Inject(PrismaService) readonly db: PrismaService) {}

  async hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const key = await scrypt(password, salt, 64) as Buffer;
    return `${salt}:${key.toString("hex")}`;
  }

  async verifyPassword(password: string, encoded: string) {
    const [salt, expectedHex] = encoded.split(":");
    if (!salt || !expectedHex) return false;
    const actual = await scrypt(password, salt, 64) as Buffer;
    const expected = Buffer.from(expectedHex, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }

  async createSession(userId: string, organizationId: string) {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
    await this.db.session.create({ data: { tokenHash: digest(token), userId, organizationId, expiresAt } });
    return { token, expiresAt };
  }

  async getSession(token?: string) {
    if (!token) return null;
    const session = await this.db.session.findUnique({
      where: { tokenHash: digest(token) },
      include: { user: { select: { id: true, email: true, name: true } }, organization: true },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;
    return session;
  }

  async revokeSession(token?: string) {
    if (token) await this.db.session.updateMany({ where: { tokenHash: digest(token), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  validMutationOrigin(req: { headers: Record<string, string | string[] | undefined>; protocol?: string; get(name: string): string | undefined }) {
    const origin = req.get("origin");
    if (!origin) return process.env.NODE_ENV !== "production";
    try {
      const forwardedHost = req.get("x-forwarded-host");
      const expectedHost = process.env.APP_URL ? new URL(process.env.APP_URL).host : forwardedHost || req.get("host");
      return Boolean(expectedHost && new URL(origin).host === expectedHost);
    } catch { return false; }
  }
}
