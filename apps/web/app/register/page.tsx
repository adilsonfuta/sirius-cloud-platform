"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cloud } from "lucide-react";
import "../globals.css";
import "../login/auth.css";
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password"), organization: form.get("organization") }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) { setError(data.error || "Não foi possível criar a conta."); return; }
    router.replace("/dashboard");
  }
  return <main className="auth-page"><Link href="/" className="auth-brand"><Cloud/> Sirius <b>Cloud</b></Link><form className="auth-card" onSubmit={submit}><span>COMEÇA NA SIRIUS CLOUD</span><h1>Criar conta</h1><p>Cria uma organização para começar a explorar o portal.</p><label>Nome<input name="name" autoComplete="name" minLength={2} required placeholder="O teu nome"/></label><label>E-mail<input type="email" name="email" autoComplete="email" required placeholder="tu@empresa.ao"/></label><label>Organização<input name="organization" minLength={2} placeholder="Opcional"/></label><label>Palavra-passe<input type="password" name="password" autoComplete="new-password" minLength={10} required/><small>Mínimo de 10 caracteres.</small></label>{error&&<div className="auth-error" role="alert">{error}</div>}<button disabled={busy}>{busy?"A criar…":"Criar conta"}</button><small>Já tens conta? <Link href="/login">Entrar</Link></small></form></main>;
}
