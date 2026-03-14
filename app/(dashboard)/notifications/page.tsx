import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getNotificationsData } from "@/lib/server/data";

export default async function Page() {
  const notifications = await getNotificationsData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <NotificationBell />
      </div>

      <div className="shell-card p-4">
        <ul className="space-y-2 text-sm text-slate-700">
          {(notifications as any[]).map((n) => (
            <li key={n.id} className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-semibold">{n.category}</span>: {n.body}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
