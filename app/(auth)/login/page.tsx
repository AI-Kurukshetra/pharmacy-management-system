"use client";

import { useState } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(payload.error ?? "Login failed");
      return;
    }
    const nextParam = new URLSearchParams(window.location.search).get("next") || "";
    const safeNext = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";
    window.location.assign(safeNext);
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_26px_60px_rgba(10,37,64,0.16)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Secure Sign In</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to continue managing your pharmacy workflows.</p>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</span>
          <Input type="email" placeholder="you@pharmacy.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Password</span>
          <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" className="h-11 w-full gap-2 rounded-full bg-gradient-to-r from-slate-900 to-sky-900 text-sm hover:from-slate-800 hover:to-sky-800" disabled={loading}>
          <LockKeyhole className="h-4 w-4" />
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <Link href="/reset-password" className="text-slate-600 hover:text-slate-900">Forgot password?</Link>
        <Link href="/signup" className="font-medium text-sky-700 hover:text-sky-800">Create account</Link>
      </div>
    </section>
  );
}
