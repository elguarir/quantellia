"use client";
import { Button } from "@/components/tailus-ui/button";
import { Title } from "@/components/tailus-ui/typography";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import React from "react";
import { Notifications } from "../app/dashboard/_components/notifications";

interface Props {
   children?: React.ReactNode;
   title?: React.ReactNode;
}
const PageWrapper = ({ title, children }: Props) => {
   const { toggle, isOpen } = useSidebar();

   return (
      <main
         data-shade="900"
         className={cn(
            "relative h-dvh overflow-auto border-x bg-[--ui-bg] transition-transform duration-300 lg:my-2.5 lg:ml-auto lg:mr-1 lg:h-[calc(100vh-20px)] lg:w-[calc(100vw-19rem)] lg:rounded-[--card-radius] lg:border lg:shadow-sm lg:shadow-gray-600/10",
            isOpen && "translate-x-72 lg:translate-x-0",
         )}
      >
         <div className="feedback-bg sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3 lg:rounded-t-[--card-radius] lg:py-2">
            <div className="flex items-center gap-2">
               <Button.Root
                  size="sm"
                  variant="ghost"
                  intent="gray"
                  className="-ml-2 focus:bg-transparent dark:focus:bg-transparent lg:hidden"
                  onClick={() => toggle()}
               >
                  <Button.Icon type="only">
                     <Menu />
                  </Button.Icon>
               </Button.Root>
               <Title size="base" weight="medium">
                  {title}
               </Title>
            </div>
            <div>
               <Notifications />
            </div>
         </div>
         <div>{children}</div>
      </main>
   );
};

export default PageWrapper;
