import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full border border-transparent bg-gradient-to-r from-[#1f3b86] to-[#635bff] px-4 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(80,76,255,0.34)] transition hover:from-[#173169] hover:to-[#4f46e5] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
