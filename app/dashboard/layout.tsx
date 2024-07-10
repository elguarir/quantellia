"use client";
import { Home, Inbox, Menu, Settings, Store, Users, X } from "lucide-react";
import { Text, Title } from "@/tailus-ui/typography";
import { PropsWithChildren, useState } from "react";
import { Search } from "./_components/search";
import Card from "@/tailus-ui/card";
import { Button } from "@/tailus-ui/button";
import * as Link from "./_components/link";
import ScrollArea from "@/tailus-ui/scrollArea";
import { UserDropdown } from "./_components/user-dropdown";

import { LogoIcon } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import {
   FolderIcon,
   HomeIcon,
   NoteBookIcon,
} from "@/components/icons";

export default function DashboardPage({ children }: PropsWithChildren) {
   const [isBannerVisible, setIsBannerVisible] = useState(true);
   const isOpen = useSidebar((state) => state.isOpen);

   const links = [
      {
         label: "Dashboard",
         icon: HomeIcon,
         href: "/dashboard",
      },
      {
         label: "Stories",
         icon: NoteBookIcon,
         href: "/dashboard/stories",
      },
      {
         label: "Documents",
         icon: FolderIcon,
         href: "/dashboard/documents",
      },
   ];

   const pathname = usePathname();

   return (
      <div
         className={cn(
            "w-full lg:flex lg:[grid-template-columns:auto_1fr]",
            isOpen && "max-lg:overflow-hidden",
         )}
      >
         <div
            className={cn(
               "invisible fixed inset-y-0 top-0 flex h-dvh w-fit origin-top scale-[0.98] overflow-hidden opacity-0 transition-all duration-300 lg:visible lg:scale-100 lg:opacity-100",
               isOpen && "visible scale-100 opacity-100",
            )}
         >
            <div className="flex w-[18rem] flex-col gap-4 px-6 py-4 pb-0 lg:w-[19rem]">
               <div className="flex w-full items-center justify-between py-2">
                  <a href="/">
                     <LogoIcon className="ml-2 w-8" />
                  </a>
                  <div>
                     <ThemeSwitcher size="sm" />
                  </div>
               </div>
               <Search />
               <ScrollArea.Root className="-mx-1 -my-4">
                  <ScrollArea.Viewport className="w-full px-1 py-4">
                     <div className="space-y-1">
                        {links.map((link) => {
                           return (
                              <Link.Root
                                 key={link.label}
                                 link={link.href}
                                 isActive={pathname === link.href}
                              >
                                 <Link.Icon>
                                    <link.icon />
                                 </Link.Icon>
                                 <Link.Label>{link.label}</Link.Label>
                              </Link.Root>
                           );
                        })}
                     </div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar orientation="vertical" />
               </ScrollArea.Root>
               <div className="mt-auto h-fit space-y-4">
                  {isBannerVisible && (
                     <Card
                        variant="soft"
                        className="relative [--card-padding:1.25rem] dark:[--ui-soft-bg:theme(colors.gray.500/0.10)]"
                     >
                        <Button.Root
                           className="absolute right-2 top-2 rounded-md"
                           size="xs"
                           variant="ghost"
                           intent="gray"
                           onClick={() => setIsBannerVisible(false)}
                        >
                           <Button.Icon type="only" size="xs">
                              <X />
                           </Button.Icon>
                        </Button.Root>
                        <Title as="div" size="base" className="text-sm">
                           Upgrade your plan
                        </Title>
                        <Text size="sm" className="mb-0 mt-2">
                           You are currently on the free plan. Upgrade to unlock
                           all features. only{" "}
                           <span className="font-semibold">$9.99/month.</span>
                        </Text>
                        {/* <Progress.Root
                           value={80}
                           data-orientation="vertical"
                           size="sm"
                           className="mt-4"
                        >
                           <Progress.Indicator
                              className="w-4/5"
                              intent="warning"
                              loading="warning"
                              complete="danger"
                           />
                        </Progress.Root> */}
                        <Button.Root
                           variant="outlined"
                           intent="gray"
                           size="xs"
                           className="mt-4 font-medium"
                        >
                           <Button.Label>Upgrade plan</Button.Label>
                        </Button.Root>
                     </Card>
                  )}
                  <UserDropdown />
               </div>
            </div>
         </div>
         {children}
      </div>
   );
}
