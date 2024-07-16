"use client";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { sendMessageSchema } from "@/lib/schemas.ts";
import { z } from "zod";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { AI } from "@/server/actions/AI/ai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { Button } from "@/components/tailus-ui/button";
import { ArrowDown } from "lucide-react";
import { Caption } from "@/components/tailus-ui/typography";
import ScrollToBottom from "./scroll-tobottom";

const Chat = () => {
   const [messages, setMessages] = useUIState<typeof AI>();
   const { sendMessage } = useActions<typeof AI>();

   const {
      isAtBottom,
      scrollToBottom,
      isVisible,
      scrollRef,
      messagesRef,
      visibilityRef,
   } = useScrollAnchor();
   const form = useForm<z.infer<typeof sendMessageSchema>>({
      resolver: zodResolver(sendMessageSchema),
      defaultValues: {
         message: "",
      },
   });

   const onSubmit = async (values: z.infer<typeof sendMessageSchema>) => {
      form.reset({ message: "" });
      const newMessageId = nanoid(8);
      setMessages((prev) => [
         ...prev,
         {
            id: newMessageId,
            display: (
               <ChatMessage role="user" id={newMessageId}>
                  {values.message}
               </ChatMessage>
            ),
            role: "user",
         },
      ]);

      try {
         const responseMessage = await sendMessage(values.message);
         setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
         ]);
      } catch (error) {
         console.error(error);
      }
   };

   console.log({
      isAtBottom,
      isVisible,
   });

   useEffect(() => {
      console.log(messages);
   }, [messages]);
   // return (
   //    <>
   //       <div className="relative h-full">
   //          <div className="mx-auto h-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
   //             {/* Title */}
   //             <div className="text-balance text-center">
   //                <Title className="text-3xl font-bold lg:text-4xl">
   //                   The Hidden Cost of Digital Convenience 💰
   //                </Title>
   //                <Caption className="mt-3">
   //                   As smart devices proliferate in our homes, experts warn of
   //                   the unseen environmental and privacy toll of our always-on
   //                   digital lifestyle.
   //                </Caption>
   //             </div>
   //             {/* End Title */}
   //             <ul className="mt-16 h-full flex-1 space-y-8">
   //                {/* Chat Bubble */}
   //                {mockMessages.map((message, index) => (
   //                   <div key={index}>{message.display}</div>
   //                ))}
   //             </ul>
   //          </div>

   //          {/* Textarea */}
   //          <footer className="sticky bottom-0 z-10 mx-auto max-w-4xl border-t border-gray-200 bg-white px-4 pb-4 pt-2 dark:border-neutral-700 dark:bg-neutral-900 sm:px-6 sm:pb-6 sm:pt-4 lg:px-0">
   //             <div className="mb-3 flex items-center justify-between">
   //                <Button.Root size="sm" intent="gray" variant="ghost">
   //                   <Button.Icon>
   //                      <Plus />
   //                   </Button.Icon>
   //                   <Button.Label>New chat</Button.Label>
   //                </Button.Root>
   //                <Button.Root size="sm" variant="outlined" intent="gray">
   //                   <Button.Icon type="leading" size="sm">
   //                      <Square />
   //                   </Button.Icon>
   //                   <Button.Label>Stop generating</Button.Label>
   //                </Button.Root>
   //             </div>
   //             <ChatInput form={form} onSubmit={onSubmit} />
   //          </footer>
   //       </div>
   //    </>
   // );

   return (
      <>
         <div className="relative min-h-[calc(100dvh-240px)]" ref={scrollRef}>
            <div className="py-10 lg:py-14">
               {/* Title */}
               <div className="mx-auto max-w-4xl text-balance px-4 text-center sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
                     The Hidden Cost of Digital Convenience 💰
                  </h1>
                  <Caption
                     size={"base"}
                     className="mt-3 text-gray-600 dark:text-neutral-400"
                  >
                     As smart devices proliferate in our homes, experts warn of
                     the unseen environmental and privacy toll of our always-on
                     digital lifestyle.
                  </Caption>
               </div>
               <ul
                  className="mt-20 min-h-[calc(100dvh-660px)] space-y-5"
                  ref={messagesRef as any}
               >
                  {messages.map((message, index) => (
                     <div key={index}>{message.display}</div>
                  ))}
               </ul>
            </div>
            <ChatInput form={form} onSubmit={onSubmit} />
            <ScrollToBottom onClick={scrollToBottom} />
         <div className="h-px w-full" ref={visibilityRef} />
         </div>
      </>
   );
};

export default Chat;
