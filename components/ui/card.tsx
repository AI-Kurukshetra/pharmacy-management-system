import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-[#d6e2f0] bg-white p-5 shadow-[0_10px_30px_rgba(10,37,64,0.08)]", className)} {...props} />;
}
