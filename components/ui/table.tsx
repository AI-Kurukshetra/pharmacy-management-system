import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full text-left text-sm [&_tbody_tr]:border-t [&_tbody_tr]:border-[#e6edf6] [&_tbody_tr:hover]:bg-[#f8fbff] [&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle [&_th]:bg-[#f8fbff] [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-[#5b6b7f]",
        className,
      )}
      {...props}
    />
  );
}
