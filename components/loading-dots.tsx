"use client";

import { cn } from "@/lib/utils";

export const LoadingDots = ({ className }: { className?: string }) => {
   const dots =
      "mx-[1px] inline-block size-[0.2225rem] bg-current animate-caret-blink rounded-md";
   return (
      <span className="mx-2 inline-flex items-center">
         <span className={cn(dots, className)} />
         <span className={cn(dots, "animation-delay-[200ms]", className)} />
         <span className={cn(dots, "animation-delay-[400ms]", className)} />
      </span>
   );
};
