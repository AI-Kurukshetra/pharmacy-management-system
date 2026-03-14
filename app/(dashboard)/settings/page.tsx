import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Manage users, pharmacy profile, and integration connectivity.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Link className="shell-card p-5 text-base font-semibold text-slate-900" href="/settings/users">Users & Roles</Link>
        <Link className="shell-card p-5 text-base font-semibold text-slate-900" href="/settings/pharmacies">Pharmacy Profile</Link>
        <Link className="shell-card p-5 text-base font-semibold text-slate-900" href="/settings/integrations">Integrations</Link>
      </div>
    </div>
  );
}
