import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-[#d6e2f0] bg-white px-3.5 text-sm text-[#0a2540] shadow-[0_2px_6px_rgba(10,37,64,0.04)] transition focus:border-[#a4bff7] focus:outline-none focus:ring-2 focus:ring-[#dbe7ff] disabled:cursor-not-allowed disabled:bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}
