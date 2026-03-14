export default function Page() {
  const services = [
    ["Surescripts", process.env.SURESCRIPTS_API_KEY ? "Connected" : "Missing API Key"],
    ["First Databank", process.env.FDB_API_KEY ? "Connected" : "Missing API Key"],
    ["NCPDP", process.env.NCPDP_API_KEY ? "Connected" : "Missing API Key"],
    ["Stripe", process.env.STRIPE_SECRET_KEY ? "Connected" : "Missing Secret"],
    ["Twilio", process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? "Connected" : "Missing SID/Auth"],
  ] as const;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Integration Settings</h1>
      <div className="grid gap-3 md:grid-cols-2">{services.map((s) => <div key={s[0]} className="shell-card p-5"><p className="text-base font-semibold text-slate-900">{s[0]}</p><p className="mt-1.5 text-sm text-slate-600">{s[1]}</p></div>)}</div>
    </div>
  );
}
