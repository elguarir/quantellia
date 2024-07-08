import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
   size?: "default" | "sm" | "md" | "lg";
}
export const Spinner = ({
   size = "default",
   className,
   ...rest
}: SpinnerProps) => {
   return (
      <div
         className={cn(
            "relative flex",
            {
               "h-8 w-8": size === "default",
               "h-4 w-4": size === "sm",
               "h-10 w-10": size === "md",
               "h-12 w-12": size === "lg",
            },
            className,
         )}
         {...rest}
      >
         <i
            className={cn(
               "absolute h-full w-full animate-spinner-ease-spin rounded-full border-solid border-b-[var(--tw-color)] border-l-transparent border-r-transparent border-t-transparent",
               {
                  "border-[3px]":
                     size === "default" || size === "md" || size === "lg",
               },
               { "border-[1.7px] sm:border-[1.8px]": size === "sm" },
            )}
         />
         <i
            className={cn(
               "absolute h-full w-full animate-spinner-linear-spin rounded-full border-dotted border-b-[var(--tw-color)] border-l-transparent border-r-transparent border-t-transparent opacity-75",
               { "border-[3px]": size === "default" || size === "lg" },
               { "border-[1.7px] sm:border-[1.8px]": size === "sm" },
            )}
         />
      </div>
   );
};
