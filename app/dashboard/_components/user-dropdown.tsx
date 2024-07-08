"use client";
import Avatar from "@/tailus-ui/avatar";
import DropdownMenu from "@/tailus-ui/dropdown-menu";
import { Button } from "@/tailus-ui/button";
import {
   ChevronUp,
   HelpCircle,
   LogOut,
   MessageCircleQuestion,
   Settings2,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Spinner } from "@/components/spinner";
import { SettingsIcon, SignoutButton, UserIcon } from "@/components/icons";
import Link from "next/link";

export const UserDropdown = () => {
   const { user } = useUser();
   const [isSigninOut, setIsSigninOut] = useState(false);
   const ref = useRef<HTMLDivElement | null>(null);
   const clerk = useClerk();
   return (
      <>
         <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
               <Button.Root
                  variant="ghost"
                  intent="gray"
                  className="w-full gap-2.5 pl-2"
               >
                  <Button.Icon>
                     <Avatar.Root size="sm" className="!size-6">
                        <Avatar.Image src={user?.imageUrl} />
                        <Avatar.Fallback>
                           {user?.firstName?.charAt(0)}{" "}
                           {user?.lastName?.charAt(0)}
                        </Avatar.Fallback>
                     </Avatar.Root>
                  </Button.Icon>
                  <Button.Label className="text-sm font-medium">
                     {user?.firstName} {user?.lastName}
                  </Button.Label>
                  <Button.Icon type="trailing" size="sm" className="ml-auto">
                     <ChevronUp />
                  </Button.Icon>
               </Button.Root>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
               <DropdownMenu.Content
                  side="bottom"
                  mixed
                  align="center"
                  sideOffset={6}
                  intent="gray"
                  variant="soft"
                  className="z-50 w-[--radix-dropdown-menu-trigger-width] dark:[--caption-text-color:theme(colors.gray.400)]"
               >
                  <DropdownMenu.Item asChild>
                     <a href="#">
                        <DropdownMenu.Icon>
                           <HelpCircle />
                        </DropdownMenu.Icon>
                        Help
                     </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                     <a href="#">
                        <DropdownMenu.Icon>
                           <MessageCircleQuestion />
                        </DropdownMenu.Icon>
                        Send feedback
                     </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item asChild>
                     <Link href="/dashboard/settings">
                        <DropdownMenu.Icon>
                           <SettingsIcon />
                        </DropdownMenu.Icon>
                        Preferences
                     </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                     onClick={() => {
                        clerk.openUserProfile();
                     }}
                  >
                     <DropdownMenu.Icon>
                        <UserIcon />
                     </DropdownMenu.Icon>
                     My Account
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                     onClick={async (e) => {
                        setIsSigninOut(true);
                        e.preventDefault();
                        e.stopPropagation();
                        await clerk.signOut({ redirectUrl: "/" });
                        setIsSigninOut(false);
                     }}
                     disabled={isSigninOut}
                  >
                     <DropdownMenu.Icon>
                        {isSigninOut ? (
                           <Spinner size="sm" />
                        ) : (
                           <SignoutButton />
                        )}
                     </DropdownMenu.Icon>
                     {isSigninOut ? "Signing out..." : "Sign out"}
                  </DropdownMenu.Item>
               </DropdownMenu.Content>
            </DropdownMenu.Portal>
         </DropdownMenu.Root>
         <div ref={ref} />
      </>
   );
};
