import { getProfilesData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getProfilesData();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users & Roles</h1></div>
      <div className="shell-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2.5 sm:px-5">Name</th><th className="px-4 py-2.5 sm:px-5">Role</th><th className="px-4 py-2.5 sm:px-5">Email</th><th className="px-4 py-2.5 sm:px-5">Status</th></tr></thead><tbody>{(rows as any[]).map((u) => <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="px-4 py-3.5 sm:px-5">{u.first_name} {u.last_name}</td><td className="px-4 py-3.5 capitalize sm:px-5">{u.role}</td><td className="px-4 py-3.5 sm:px-5">{u.email}</td><td className="px-4 py-3.5 sm:px-5">{u.is_active ? "Active" : "Inactive"}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
