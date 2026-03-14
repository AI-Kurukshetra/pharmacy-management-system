import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-[#d6e2f0] bg-white px-3.5 text-sm text-[#0a2540] shadow-[0_2px_6px_rgba(10,37,64,0.04)] transition placeholder:text-slate-400 focus:border-[#a4bff7] focus:outline-none focus:ring-2 focus:ring-[#dbe7ff] disabled:cursor-not-allowed disabled:bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}
