import Avatar from "@/tailus-ui/avatar";
import { Button } from "@/tailus-ui/button";
import { Text, Caption } from "@/tailus-ui/typography";
import Badge from "@/tailus-ui/badge";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export const ChatLink = ({
   isActive = false,
   userName,
   link,
   avatar,
   lastMessage,
   unread,
   date,
   isUnread,
}: {
   isActive?: boolean;
   isUnread?: boolean;
   avatar: string;
   lastMessage: string;
   unread?: number;
   date: string;
   userName?: string;
   link: string;
}) => {
   return (
      <Button.Root
         variant={isActive ? "soft" : "ghost"}
         intent="gray"
         className={twMerge(
            "grid h-auto gap-3 p-3 [grid-template-columns:auto_1fr]",
            isActive && "dark:bg-[--ui-soft-bg]",
         )}
         aria-label={userName}
         asChild
      >
         <Link href={link}>
            <Avatar.Root
               size="lg"
               status="busy"
               topStatus={isUnread}
               className="before:right-0 before:top-0 before:size-1.5 before:border-none"
            >
               <Avatar.Image
                  src={avatar}
                  loading="lazy"
                  alt={userName}
                  width={120}
                  height={120}
               />
               <Avatar.Fallback children="MI" />
            </Avatar.Root>
            <div className="flex flex-col">
               <div className="flex">
                  <Text
                     as="p"
                     size="sm"
                     className="line-clamp-1"
                     weight="medium"
                  >
                     {userName}
                  </Text>
                  <Caption as="p" size="xs" className="ml-auto">
                     {date}
                  </Caption>
               </div>
               <div className="flex justify-between [--body-text-color:theme(colors.gray.500)] dark:[--body-text-color:theme(colors.gray.400)]">
                  <Text as="p" className="line-clamp-1 text-sm">
                     {lastMessage}
                  </Text>
                  {unread && unread > 0 && (
                     <Badge
                        size="xs"
                        intent="primary"
                        variant="solid"
                        className="rounded-full"
                     >
                        {unread}
                     </Badge>
                  )}
               </div>
            </div>
         </Link>
      </Button.Root>
   );
};
