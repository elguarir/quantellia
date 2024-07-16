"use client";
import { MemoizedReactMarkdown } from "@/components/chat-markdown";
import Avatar from "@/components/tailus-ui/avatar";
import { Button } from "@/components/tailus-ui/button";
import { AI } from "@/server/actions/AI/ai";
import { useUser } from "@clerk/nextjs";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useActions, useStreamableValue, useUIState } from "ai/rsc";
import { Copy, User2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface ChatMessageProps {
   id: string;
   role: "user" | "assistant";
   children?: React.ReactNode;
   markdown?: boolean;
}
const ChatMessage = ({
   markdown = false,
   role,
   children,
   id,
}: ChatMessageProps) => {
   const [_, copy] = useCopyToClipboard();
   const [copied, setCopied] = useState(false);
   const user = useUser();
   // const value = useStreamableValue(children);
   const handleCopy = async () => {
      if (!children || !markdown) return;
      await copy(children as string);
      setCopied(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCopied(false);
   };

   if (role === "user") {
      return (
         <>
            <li className="py-2 sm:py-4">
               <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                  <div className="flex max-w-2xl gap-x-2 sm:gap-x-4">
                     <div className="inline-flex size-[38px] flex-shrink-0 items-center justify-center rounded-full">
                        <Avatar.Root>
                           <Avatar.Image src={user.user?.imageUrl} />
                           <Avatar.Fallback className="bg-gray-500">
                              <User2 />
                           </Avatar.Fallback>
                        </Avatar.Root>
                     </div>
                     <div className="mt-2 grow space-y-3">
                        {markdown ? (
                           <MemoizedReactMarkdown
                              className="prose prose-sm prose-violet break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                              remarkPlugins={[remarkGfm, remarkMath]}
                              components={{
                                 p({ children: content }) {
                                    return (
                                       <p className="mb-2 last:mb-0">
                                          {content}
                                       </p>
                                    );
                                 },
                              }}
                           >
                              {children as string}
                           </MemoizedReactMarkdown>
                        ) : (
                           <>{children}</>
                        )}
                     </div>
                  </div>
               </div>
            </li>
         </>
      );
   } else {
      return (
         <>
            <li className="mx-auto flex max-w-4xl gap-x-2 px-4 py-2 sm:gap-x-4 sm:px-6 lg:px-8">
               <svg
                  className="h-[2.375rem] w-[2.375rem] flex-shrink-0 rounded-full"
                  width={38}
                  height={38}
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <rect width={38} height={38} rx={6} fill="#2563EB" />
                  <path
                     d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25"
                     stroke="white"
                     strokeWidth="1.5"
                  />
                  <path
                     d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25"
                     stroke="white"
                     strokeWidth="1.5"
                  />
                  <ellipse
                     cx={19}
                     cy="18.6554"
                     rx="3.75"
                     ry="3.6"
                     fill="white"
                  />
               </svg>
               <div className="w-full max-w-[90%] grow space-y-3 md:max-w-2xl">
                  {/* Card */}
                  <div className="space-y-3">
                     {markdown ? (
                        <MemoizedReactMarkdown
                           className="prose prose-sm prose-violet break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                           remarkPlugins={[remarkGfm, remarkMath]}
                           components={{
                              p({ children }) {
                                 return (
                                    <p className="mb-2 last:mb-0">{children}</p>
                                 );
                              },
                           }}
                        >
                           {children as string}
                        </MemoizedReactMarkdown>
                     ) : (
                        <>{children}</>
                     )}
                  </div>
                  <div>
                     <div className="flex justify-between">
                        <div>
                           {markdown && (
                              <Button.Root
                                 size="sm"
                                 className="rounded-full"
                                 variant="ghost"
                                 intent="gray"
                                 onClick={handleCopy}
                              >
                                 <Button.Icon size="xs" type="leading">
                                    <Copy />
                                 </Button.Icon>
                                 <Button.Label>
                                    {copied ? "Copied!" : "Copy"}
                                 </Button.Label>
                              </Button.Root>
                           )}
                        </div>
                        <div>
                           {/* wanted to implement generating a new answer feature but theresn't much time left */}
                           <Button.Root
                              size="sm"
                              className="rounded-full"
                              variant="ghost"
                              intent="gray"
                           >
                              <Button.Icon size="xs" type="leading">
                                 <ReloadIcon />
                              </Button.Icon>
                              <Button.Label>New answer</Button.Label>
                           </Button.Root>
                        </div>
                     </div>
                  </div>
               </div>
            </li>
         </>
      );
   }
};

export default ChatMessage;
