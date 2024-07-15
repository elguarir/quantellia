"use client";
import { Button } from "@/components/tailus-ui/button";
import Textarea from "@/components/tailus-ui/text-area";
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import useKeypress from "@/hooks/use-key-press";
import { MessageCircleDashed, Send, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { CoreMessage } from "ai";
import Tooltip from "@/components/tailus-ui/tooltip";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useServerAction } from "zsa-react";
import { ChatMessage } from "../../_components/chat-message";
import { answerQuestion, updateChatMessages } from "@/server/actions";
import { readStreamableValue } from "ai/rsc";
import { toast } from "sonner";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface ChatSheetProps {
   docId: string;
   chatId?: string;
   initialMessages: CoreMessage[];
}

const formSchema = z.object({
   message: z.string().min(1, "Required").min(4, "Too short"),
});

const ChatSheet = (p: ChatSheetProps) => {
   const router = useRouter();

   const [isOpen, setOpen] = useState(false);
   const [messages, setMessages] = useState<CoreMessage[]>(p.initialMessages);
   const ref = useRef<HTMLDivElement>(null);
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      mode: "onSubmit",
      defaultValues: {
         message: "",
      },
   });
   const { execute, isPending } = useServerAction(answerQuestion, {
      onSuccess: async () => {
         if (!p.chatId) return;
         await updateChatMessages({
            chatId: p.chatId,
            messages: messages,
            docId: p.docId,
         });
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      if (!p.chatId) {
         return;
      }
      const newMessages: CoreMessage[] = [
         ...messages,
         { content: values.message, role: "user" },
      ];
      setMessages(newMessages);

      const [result, err] = await execute({
         messages: newMessages,
         chatId: p.chatId,
         docId: p.docId,
      });
      if (err || !result) {
         toast.error(err?.message);
         return;
      }

      for await (const content of readStreamableValue(result)) {
         setMessages([
            ...newMessages,
            {
               role: "assistant",
               content: content as string,
            },
         ]);
      }
   };

   useKeypress("c", (e) => {
      setOpen(true);
   });

   return (
      <Sheet open={isOpen} onOpenChange={setOpen}>
         {!p.chatId ? (
            <>
               <Tooltip.Root delayDuration={100}>
                  <Tooltip.Trigger asChild>
                     <Button.Root disabled={true}>
                        <Button.Icon>
                           <MessageCircleDashed />
                        </Button.Icon>
                        <Button.Label>Ask AI</Button.Label>
                     </Button.Root>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                     <Tooltip.Content side="bottom" align="end">
                        The document hasn't been processed yet, please wait for
                        a few seconds.
                     </Tooltip.Content>
                  </Tooltip.Portal>
               </Tooltip.Root>
            </>
         ) : (
            <SheetTrigger asChild>
               <Button.Root>
                  <Button.Icon>
                     <MessageCircleDashed />
                  </Button.Icon>
                  <Button.Label>Ask AI</Button.Label>
               </Button.Root>
            </SheetTrigger>
         )}

         <SheetContent
            side={"right"}
            className="px-0 sm:max-w-[30rem]"
            data-shade="925"
            ref={ref}
         >
            <SheetHeader className="px-6 pb-4">
               <SheetTitle>Chat with AI</SheetTitle>
               <SheetDescription>
                  You can chat your Quantellia's AI Buddy here, you can ask
                  questions or just have a chat.
               </SheetDescription>
            </SheetHeader>
            <div className="relative h-[calc(100dvh-140px)]">
               <div className="h-[calc(100%-128px)] w-full overflow-y-auto border-t px-6 pb-6 pt-4">
                  <div className="w-full divide-y">
                     {messages.map((message, index) => (
                        <div className="py-6 first:pt-4" key={index}>
                           <ChatMessage message={message} />
                        </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -bottom-6 w-full border-t bg-background px-6 py-4 shadow-lg">
                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                     >
                        <fieldset className="flex w-full flex-col space-y-2">
                           <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormControl>
                                       <Textarea
                                          rows={3}
                                          aria-label="Message"
                                          variant="outlined"
                                          placeholder="Enter your message"
                                          className={cn(
                                             "resize-none",
                                             form.formState.errors.message &&
                                                "focus:outline-danger focus-visible:outline-danger",
                                          )}
                                          {...field}
                                       />
                                    </FormControl>
                                 </FormItem>
                              )}
                           />
                           <div className="flex items-center justify-end gap-2">
                              {form.formState.errors.message?.message && (
                                 <Tooltip.Root delayDuration={100}>
                                    <Tooltip.Trigger asChild type="button">
                                       <Button.Root
                                          variant="soft"
                                          intent="danger"
                                          size="sm"
                                       >
                                          <Button.Icon type="only">
                                             <InfoCircledIcon />
                                          </Button.Icon>
                                       </Button.Root>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal container={ref.current}>
                                       <Tooltip.Content
                                          side="top"
                                          align="center"
                                       >
                                          {
                                             form.formState.errors.message
                                                .message
                                          }
                                       </Tooltip.Content>
                                    </Tooltip.Portal>
                                 </Tooltip.Root>
                              )}
                              <Button.Root
                                 size="sm"
                                 variant="soft"
                                 intent="primary"
                                 type="submit"
                                 disabled={isPending}
                              >
                                 <Button.Label>
                                    {isPending ? "Hold on..." : "Send"}
                                 </Button.Label>
                                 <Button.Icon type="trailing">
                                    <SendHorizontal />
                                 </Button.Icon>
                              </Button.Root>
                           </div>
                        </fieldset>
                     </form>
                  </Form>
               </div>
            </div>
         </SheetContent>
      </Sheet>
   );
};

export default ChatSheet;
