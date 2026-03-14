import { Button } from "@/components/ui/button";

export function ConfirmDialog({ message = "Are you sure?" }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-[#d6e2f0] bg-white p-4 shadow-[0_12px_30px_rgba(10,37,64,0.08)]">
      <p className="mb-3 text-sm text-[#425466]">{message}</p>
      <div className="flex gap-2">
        <Button type="button">Confirm</Button>
        <Button type="button" className="border-[#d6e2f0] bg-white text-[#425466] shadow-sm hover:bg-[#f8fbff]">
          Cancel
        </Button>
      </div>
    </div>
  );
}
