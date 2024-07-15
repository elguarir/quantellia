"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/tailus-ui/button";

interface ButtonScrollToBottomProps
   extends React.ComponentProps<typeof Button.Root> {
   isAtBottom: boolean;
   scrollToBottom: () => void;
   className?: string;
}

export function ButtonScrollToBottom({
   className,
   isAtBottom,
   scrollToBottom,
   ...props
}: ButtonScrollToBottomProps) {
   return (
      <Button.Root
         variant="outlined"
         className={cn(
            "absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2",
            isAtBottom ? "opacity-0" : "opacity-100",
            className,
         )}
         intent="gray"
         onClick={() => scrollToBottom()}
         {...props}
      >
         <ArrowDown />
         <span className="sr-only">Scroll to bottom</span>
      </Button.Root>
   );
}
