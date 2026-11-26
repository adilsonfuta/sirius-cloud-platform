"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Account = { name: string; email: string };
export default function AccountControl() {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  useEffect(() => { fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(data => data?.user && setAccount(data.user)).catch(() => {}); }, []);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); }
  const initials = account?.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "SC";
  return <details className="account-control"><summary className="profile-button"><span className="profile-photo">{initials}</span><span><b>{account?.name || "A carregar conta…"}</b><small>{account?.email || "Sessão protegida"}</small></span><ChevronDown/></summary><div className="account-menu"><button onClick={logout}>Terminar sessão</button></div></details>;
}
