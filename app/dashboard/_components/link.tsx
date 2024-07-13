import { Button } from "@/tailus-ui/button";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import NextLink from "next/link";

export const Link = ({
   isActive = false,
   label,
   link,
   children,
}: {
   isActive?: boolean;
   children?: ReactNode;
   label?: string;
   link: string;
}) => {
   return (
      <Button.Root
         variant={isActive ? "outlined" : "ghost"}
         intent="gray"
         className={twMerge(
            "justify-start gap-3.5 px-4",
            isActive &&
               "bg-white dark:bg-gray-500/10 dark:!shadow-none dark:[--btn-border-color:theme(colors.transparent)]",
         )}
         aria-label={label}
         asChild
      >
         <NextLink href={link}>
            <Button.Icon size="sm" type="leading">
               {children}
            </Button.Icon>
            <Button.Label className="text-sm">{label}</Button.Label>
         </NextLink>
      </Button.Root>
   );
};

export const Root = ({
   isActive = false,
   link,
   children,
}: {
   isActive?: boolean;
   children: ReactNode;
   link: string;
}) => (
   <Button.Root
      variant={isActive ? "outlined" : "ghost"}
      intent="gray"
      className={twMerge(
         "justify-start gap-3.5 px-4",
         isActive &&
            "bg-white dark:bg-gray-500/10 dark:!shadow-none dark:[--btn-border-color:theme(colors.transparent)]",
      )}
      asChild
   >
      <NextLink href={link}>{children}</NextLink>
   </Button.Root>
);

export const Icon = ({ children }: { children: ReactNode }) => (
   <Button.Icon size="sm" type="leading">
      {children}
   </Button.Icon>
);

export const Label = ({ children }: { children: ReactNode }) => (
   <Button.Label className="text-sm">{children}</Button.Label>
);
