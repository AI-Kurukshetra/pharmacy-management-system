export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8ff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.30),transparent_40%),radial-gradient(circle_at_78%_4%,rgba(14,165,233,0.26),transparent_38%),linear-gradient(140deg,#0a2540_10%,#1f3b86_48%,#4f46e5_100%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-[330px] h-24 -skew-y-3 bg-[#f5f8ff]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.16em] text-white/95">SMART PHARMACY PLATFORM</p>
          <div className="hidden items-center gap-6 text-sm text-white/85 md:flex">
            <span>Security</span>
            <span>Compliance</span>
            <span>Support</span>
          </div>
        </header>

        <section className="grid items-start gap-8 lg:grid-cols-[1.1fr_460px]">
          <div className="hidden space-y-5 pt-4 text-white lg:block">
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">Reliable access for modern pharmacy operations.</h1>
            <p className="max-w-lg text-base text-blue-100/90">Claims, prescriptions, compliance, and patient workflows in one secure control plane.</p>
            <div className="grid max-w-lg grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2.5">99.99% platform uptime</div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2.5">Role-isolated access</div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2.5">HIPAA safeguards</div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2.5">Realtime operations</div>
            </div>
          </div>

          <section className="w-full">{children}</section>
        </section>
      </div>
    </main>
  );
}
