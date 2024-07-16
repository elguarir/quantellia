"use client";
import Textarea from "@/components/tailus-ui/text-area";
import UploadAttachement from "./upload-attachement";
import { Button } from "@/components/tailus-ui/button";
import { Mic, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendMessageSchema } from "@/lib/schemas.ts";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";

interface ChatInputProps {
   form: ReturnType<typeof useForm<z.infer<typeof sendMessageSchema>>>;
   onSubmit: (values: z.infer<typeof sendMessageSchema>) => Promise<void>;
}

const ChatInput = ({ form, onSubmit }: ChatInputProps) => {
   return (
      <>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="sticky bottom-0 z-10 border-t border-gray-200 bg-white pb-3 pt-2 dark:border-neutral-700 dark:bg-neutral-900 sm:pb-6 sm:pt-4"
            >
               <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-3 flex items-center justify-between"></div>
                  {/* Input */}
                  <div
                     className={cn(
                        // base
                        "relative overflow-hidden rounded-lg border-2 border-gray-200 transition-colors duration-200 hover:border-neutral-700/60 dark:border-neutral-700 hover:dark:border-neutral-600/80",
                        // focus
                        "focus-within:!border-primary",
                        // error
                        "data-[invalid=true]:!border-danger",
                     )}
                     data-invalid={form.formState.errors.message}
                  >
                     <Textarea
                        className="block w-full resize-none bg-transparent p-4 pb-12 text-sm focus-visible:outline-none"
                        placeholder="Ask me anything..."
                        defaultValue={""}
                        variant="plain"
                        {...form.register("message")}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                           }
                        }}
                     />
                     
                     {/* Toolbar */}
                     <div className="absolute inset-x-px bottom-px rounded-b-lg bg-white p-2 pt-1 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center">
                              <UploadAttachement />
                           </div>
                           <div className="flex items-center gap-x-1">
                              <Button.Root
                                 size="sm"
                                 variant="ghost"
                                 intent="gray"
                              >
                                 <Button.Icon type="only" size="sm">
                                    <Mic />
                                 </Button.Icon>
                                 <Button.Label className="sr-only">
                                    Send a voice message
                                 </Button.Label>
                              </Button.Root>
                              <Button.Root
                                 type="submit"
                                 size="sm"
                                 variant="soft"
                                 intent="primary"
                                 disabled={
                                    form.formState.isSubmitting ||
                                    form.watch("message") === ""
                                 }
                              >
                                 <Button.Icon type="only" size="sm">
                                    <Send />
                                 </Button.Icon>
                                 <Button.Label className="sr-only">
                                    Send
                                 </Button.Label>
                              </Button.Root>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </form>
         </Form>
      </>
   );
};

export default ChatInput;
