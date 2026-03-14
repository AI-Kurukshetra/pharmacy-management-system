export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Supplier Detail</h1>
      <div className="shell-card grid gap-2 p-4 text-sm md:grid-cols-2">
        <p><span className="font-semibold">Name:</span> Cardinal Health</p>
        <p><span className="font-semibold">DEA:</span> SUP-DEA-9911</p>
        <p><span className="font-semibold">Contact:</span> ops@cardinal.example</p>
        <p><span className="font-semibold">EDI:</span> enabled</p>
      </div>
    </div>
  );
}
