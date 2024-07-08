import { cloneElement } from "@/lib/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { Button } from "@/tailus-ui/button";
import { button } from "@tailus/themer";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Link = ({
   isActive = false,
   link,
   children,
}: {
   isActive?: boolean;
   children: ReactNode;
   link: string;
}) => {
   return (
      <Button.Root
         href={link}
         variant={isActive ? "outlined" : "ghost"}
         intent="gray"
         className={twMerge(
            "justify-start gap-3.5 pl-[42px] pr-3",
            isActive &&
               "bg-white dark:bg-gray-500/10 dark:!shadow-none dark:[--btn-border-color:theme(colors.transparent)]",
         )}
      >
         <Button.Label className="text-sm">{children}</Button.Label>
      </Button.Root>
   );
};

export const Group = ({
   children,
   value,
}: {
   value: string;
   children: ReactNode;
}) => {
   return <Accordion.Item value={value}>{children}</Accordion.Item>;
};

export const Content = ({ children }: { children: ReactNode }) => (
   <Accordion.Content className="space-y-1 overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
      {children}
   </Accordion.Content>
);

export const Trigger = ({ children }: { children: ReactNode }) => (
   <Accordion.Header>
      <Accordion.Trigger
         className={button.ghost({
            intent: "gray",
            size: "md",
            className: "w-full justify-start gap-3.5 px-3 text-sm",
         })}
      >
         {children}
         <ChevronDown className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] ml-auto size-4 opacity-75 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
   </Accordion.Header>
);

export const Icon = ({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) =>
   cloneElement(children as React.ReactElement, twMerge("size-4", className));

export const Root = ({ children }: { children: ReactNode }) => {
   return (
      <Accordion.Root type="multiple" className="space-y-1">
         {children}
      </Accordion.Root>
   );
};
