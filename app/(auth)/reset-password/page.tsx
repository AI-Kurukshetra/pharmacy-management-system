"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(payload.error ?? "Failed to send reset link");
      return;
    }
    setMessage(payload.message ?? "Reset link sent");
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_26px_60px_rgba(10,37,64,0.16)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Account Recovery</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Reset password</h1>
      <p className="mt-2 text-sm text-slate-600">Send a secure reset link to your registered email.</p>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</span>
          <Input type="email" placeholder="you@pharmacy.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <Button type="submit" className="h-11 w-full rounded-full bg-gradient-to-r from-slate-900 to-sky-900 text-sm hover:from-slate-800 hover:to-sky-800" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-sky-700 hover:text-sky-800">
          Back to sign in
        </Link>
      </p>
    </section>
  );
}
