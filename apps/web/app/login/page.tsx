"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cloud } from "lucide-react";
import "../globals.css";
import "./auth.css";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) { setError(data.error || "Não foi possível entrar."); return; }
    const next = new URLSearchParams(location.search).get("next"); router.replace(next?.startsWith("/dashboard") ? next : "/dashboard");
  }
  return <main className="auth-page"><Link href="/" className="auth-brand"><Cloud/> Sirius <b>Cloud</b></Link><form className="auth-card" onSubmit={submit}><span>PORTAL SIRIUS CLOUD</span><h1>Bem-vindo de volta</h1><p>Entra na tua conta para gerir os teus projectos.</p><label>E-mail<input type="email" name="email" autoComplete="email" required placeholder="tu@empresa.ao"/></label><label>Palavra-passe<input type="password" name="password" autoComplete="current-password" required/></label>{error&&<div className="auth-error" role="alert">{error}</div>}<button disabled={busy}>{busy?"A entrar…":"Entrar"}</button><small>Não tens conta? <Link href="/register">Criar conta</Link></small></form></main>;
}
