"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ReactNode } from "react";

export default function ProgressBarProvider({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <>
         <ProgressBar
            color="hsl(var(--primary))"
            shallowRouting
            options={{ showSpinner: false }}
         />
         {children}
      </>
   );
}
