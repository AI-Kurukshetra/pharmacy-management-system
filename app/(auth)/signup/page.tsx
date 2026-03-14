"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    const payload = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(payload.error || "Unable to create account");
      return;
    }

    if (payload.needs_email_confirmation) {
      setMessage("Account created. Check your email for verification, then sign in.");
      return;
    }

    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!loginRes.ok) {
      setMessage("Account created. Please sign in manually.");
      window.location.assign("/login");
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_26px_60px_rgba(10,37,64,0.16)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Create Account</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Start with secure access</h1>
      <p className="mt-2 text-sm text-slate-600">Provision your identity for your pharmacy organization.</p>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">First name</span>
            <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Last name</span>
            <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11" />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Work email</span>
          <Input type="email" placeholder="you@pharmacy.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Password</span>
          <Input type="password" placeholder="Minimum 8 characters" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <Button type="submit" className="h-11 w-full rounded-full bg-gradient-to-r from-slate-900 to-sky-900 text-sm hover:from-slate-800 hover:to-sky-800" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-sky-700 hover:text-sky-800">
          Sign in
        </Link>
      </p>
    </section>
  );
}
