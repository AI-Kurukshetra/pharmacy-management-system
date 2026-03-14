const items = [
  "RX-10344 moved to verification",
  "Low stock alert: Apixaban 5mg",
  "PA-4421 follow-up due today",
];

export function NotificationList() {
  return (
    <div className="shell-card p-4">
      <p className="text-sm font-semibold">Recent Notifications</p>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((i) => <li key={i} className="rounded-lg bg-slate-50 px-3 py-2">{i}</li>)}
      </ul>
    </div>
  );
}
