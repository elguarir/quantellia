"use client";
import { Home, Inbox, Menu, Settings, Store, Users, X } from "lucide-react";
import { Caption, Text, Title } from "@/tailus-ui/typography";
import { PropsWithChildren, useState } from "react";
import { Search } from "./_components/search";
import Card from "@/tailus-ui/card";
import Progress from "@/tailus-ui/progress";
import { Button } from "@/tailus-ui/button";
import { WorkspaceIcon } from "./_components/workspace-icon";
import { twMerge } from "tailwind-merge";
import * as LinkList from "./_components/link-list";
import * as Link from "./_components/link";
import ScrollArea from "@/tailus-ui/scrollArea";
import { UserDropdown } from "./_components/user-dropdown";

import { LogoIcon } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export default function DashboardPage({ children }: PropsWithChildren) {
   const [isBannerVisible, setIsBannerVisible] = useState(true);
   const isOpen = useSidebar((state) => state.isOpen);

   return (
      <div
         className={cn(
            "w-full lg:flex lg:[grid-template-columns:auto_1fr]",
            isOpen && "max-lg:overflow-hidden",
         )}
      >
         <div
            className={twMerge(
               "invisible fixed inset-y-0 top-0 flex h-dvh w-fit origin-top scale-[0.98] overflow-hidden opacity-0 transition-all duration-300 lg:visible lg:scale-100 lg:opacity-100",
               isOpen && "visible scale-100 opacity-100",
            )}
         >
            <div className="flex w-[18rem] flex-col gap-4 px-6 py-4 pb-0 lg:w-[19rem]">
               <div className="flex w-full items-center justify-between py-2">
                  <div>
                     <LogoIcon className="ml-2 w-8" />
                  </div>
                  <div>
                     <ThemeSwitcher size="sm" />
                  </div>
               </div>
               <Search />
               <ScrollArea.Root className="-mx-1 -my-4">
                  <ScrollArea.Viewport className="w-full px-1 py-4">
                     <div className="space-y-1">
                        <Link.Root link="#" isActive>
                           <Link.Icon>
                              <Home />
                           </Link.Icon>
                           <Link.Label>Dashboard</Link.Label>
                        </Link.Root>
                        <LinkList.Root>
                           <LinkList.Group value="store">
                              <LinkList.Trigger>
                                 <LinkList.Icon>
                                    <Store />
                                 </LinkList.Icon>
                                 Store
                              </LinkList.Trigger>
                              <LinkList.Content>
                                 <LinkList.Link link="/">
                                    Customers
                                 </LinkList.Link>
                                 <LinkList.Link link="/">Orders</LinkList.Link>
                                 <LinkList.Link link="/">
                                    Products
                                 </LinkList.Link>
                                 <LinkList.Link link="/">
                                    Discounts
                                 </LinkList.Link>
                              </LinkList.Content>
                           </LinkList.Group>
                           <LinkList.Group value="team">
                              <LinkList.Trigger>
                                 <LinkList.Icon>
                                    <Users />
                                 </LinkList.Icon>
                                 Team
                              </LinkList.Trigger>
                              <LinkList.Content>
                                 <LinkList.Link link="/">General</LinkList.Link>
                                 <LinkList.Link link="/">
                                    Affiliates
                                 </LinkList.Link>
                                 <LinkList.Link link="/">
                                    Products
                                 </LinkList.Link>
                                 <LinkList.Link link="/">
                                    Discounts
                                 </LinkList.Link>
                              </LinkList.Content>
                           </LinkList.Group>
                           <LinkList.Group value="settings">
                              <LinkList.Trigger>
                                 <LinkList.Icon>
                                    <Settings />
                                 </LinkList.Icon>
                                 Settings
                              </LinkList.Trigger>
                              <LinkList.Content>
                                 <LinkList.Link link="/">General</LinkList.Link>
                                 <LinkList.Link link="/">
                                    Affiliates
                                 </LinkList.Link>
                                 <LinkList.Link link="/">
                                    Products
                                 </LinkList.Link>
                                 <LinkList.Link link="/">
                                    Discounts
                                 </LinkList.Link>
                              </LinkList.Content>
                           </LinkList.Group>
                        </LinkList.Root>
                        <Link.Root link="#">
                           <Link.Icon>
                              <Inbox />
                           </Link.Icon>
                           <Link.Label>Inbox</Link.Label>
                        </Link.Root>
                     </div>
                     <div className="mt-4">
                        <Caption className="mx-2">Workspaces</Caption>
                        <div className="mt-4 space-y-1">
                           <Link.Root link="#">
                              <Link.Icon>
                                 <WorkspaceIcon intent="primary" />
                              </Link.Icon>
                              <Link.Label>Tailus UI React</Link.Label>
                           </Link.Root>
                           <Link.Root link="#">
                              <Link.Icon>
                                 <WorkspaceIcon intent="secondary" />
                              </Link.Icon>
                              <Link.Label>Tailus UI Themer</Link.Label>
                           </Link.Root>
                           <Link.Root link="#">
                              <Link.Icon>
                                 <WorkspaceIcon intent="accent" />
                              </Link.Icon>
                              <Link.Label>Tailus UI HTML</Link.Label>
                           </Link.Root>
                        </div>
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
                           className="absolute right-2 top-2"
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
                           Storage almost full
                        </Title>
                        <Text size="sm" className="mb-0 mt-2">
                           Upgrade your plan to get more storage
                        </Text>
                        <Progress.Root
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
                        </Progress.Root>
                        <Button.Root
                           variant="outlined"
                           intent="gray"
                           size="xs"
                           className="mt-4 font-medium"
                        >
                           <Button.Label className="text-primary-600 dark:text-primary-400">
                              Upgrade plan
                           </Button.Label>
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
