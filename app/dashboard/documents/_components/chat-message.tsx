import { CoreMessage, Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import { MemoizedReactMarkdown } from "@/components/chat-markdown";
import { User2 } from "lucide-react";
import { LogoIcon } from "@/components/logo";
import Badge from "@/components/tailus-ui/badge";
import { useUser } from "@clerk/nextjs";
import Avatar from "@/components/tailus-ui/avatar";

export interface ChatMessageProps {
   message: CoreMessage;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
   const user = useUser();

   return (
      <div className={cn("group relative flex items-start")} {...props}>
         <Badge
            variant={"outlined"}
            intent="gray"
            className="flex flex-shrink-0 select-none items-center justify-center rounded-full p-1.5 shadow-sm"
         >
            {message.role === "user" ? (
               <Avatar.Root className="size-8">
                  <Avatar.Image src={user.user?.imageUrl} />
                  <Avatar.Fallback>
                     <User2 />
                  </Avatar.Fallback>
               </Avatar.Root>
            ) : (
               <LogoIcon className="size-8" />
            )}
         </Badge>
         <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
            <MemoizedReactMarkdown
               className="prose prose-sm prose-violet break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
               remarkPlugins={[remarkGfm, remarkMath]}
               components={{
                  p({ children }) {
                     return <p className="mb-2 last:mb-0">{children}</p>;
                  },
               }}
            >
               {message.content as string}
            </MemoizedReactMarkdown>
         </div>
      </div>
   );
}
