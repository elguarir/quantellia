"use client";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";

import { Button } from "@/components/tailus-ui/button";
import useKeypress from "@/hooks/use-key-press";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/tailus-ui/dialog";
import SeparatorRoot from "@/components/tailus-ui/separator";
import Label from "@/components/tailus-ui/label";
import Input from "@/components/tailus-ui/input";
import { Caption } from "@/components/tailus-ui/typography";
import Checkbox from "@/components/tailus-ui/checkbox";
import { Check } from "lucide-react";
import Textarea from "@/components/tailus-ui/text-area";
import Aligner from "@/components/tailus-ui/aligner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newStorySchema } from "@/lib/schemas.ts";
import { useServerAction } from "zsa-react";
import { createNewStoryAction } from "@/server/actions";
import { toast } from "sonner";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const AddStorySheet = () => {
   const [isOpen, setOpen] = useState(false);
   const router = useRouter();
   const { execute, isPending } = useServerAction(createNewStoryAction, {
      onSuccess: ({ data }) => {
         let isReady = data.story.readyToStart;
         if (isReady) {
            toast.success(
               "Story created successfully, you will be redirected soon",
            );
            router.push(`/dashboard/stories/${data.story.id}`);
         } else {
            toast.success(
               "Story created successfully, it will be processed soon",
            );
         }
         setOpen(false);
      },
      onError: ({ err }) => {
         toast.error(err.message);
      },
   });
   const form = useForm<z.infer<typeof newStorySchema>>({
      resolver: zodResolver(newStorySchema),
   });

   const date = {
      from: form.watch("from"),
      to: form.watch("to"),
   };

   const onSubmit = async (values: z.infer<typeof newStorySchema>) => {
      execute(values);
   };

   useKeypress("n", (e) => {
      setOpen(true);
   });

   return (
      <>
         <Dialog.Root open={isOpen} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
               <Button.Root size="sm">
                  <Button.Label>New Story</Button.Label>
                  <Button.Icon type="trailing">
                     <PlusIcon className="h-5 w-5" />
                  </Button.Icon>
               </Button.Root>
            </Dialog.Trigger>
            <Dialog.Portal>
               <Dialog.Overlay className="z-40" />
               <Dialog.Content
                  mixed
                  className="z-50 max-w-lg focus-visible:outline-none"
               >
                  <Dialog.Title>New Story</Dialog.Title>
                  <Dialog.Description
                     size="sm"
                     className="mt-1 text-[--caption-text-color]"
                  >
                     Every great story begins with a single word. What
                     masterpiece will you create today?
                  </Dialog.Description>

                  <SeparatorRoot dashed className="my-6" />

                  <Form {...form}>
                     <div className="grid space-y-4">
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                           <fieldset className="space-y-5" disabled={isPending}>
                              <FormField
                                 control={form.control}
                                 name="title"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>
                                          Title{" "}
                                          <span className="text-danger">*</span>
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="Add your story title"
                                             {...field}
                                          />
                                       </FormControl>
                                       <FormDescription>
                                          make sure to add a title that
                                          describes your story
                                       </FormDescription>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <FormField
                                 control={form.control}
                                 name="description"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Description</FormLabel>
                                       <FormControl>
                                          <Textarea
                                             placeholder="Add your story description"
                                             {...field}
                                             className="h-28 max-h-36 min-h-12"
                                          />
                                       </FormControl>
                                       <FormDescription></FormDescription>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                              <FormField
                                 control={form.control}
                                 name="searchForContext"
                                 render={({ field }) => (
                                    <FormItem>
                                       {/* <FormLabel>Description</FormLabel> */}
                                       <Aligner>
                                          <FormControl>
                                             <Checkbox.Root
                                                checked={field.value}
                                                onCheckedChange={(value) => {
                                                   field.onChange(value);
                                                }}
                                                intent="primary"
                                                id={field.name}
                                                name={field.name}
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                                disabled={field.disabled}
                                                defaultChecked={true}
                                             >
                                                <Checkbox.Indicator>
                                                   <Check
                                                      className="size-3.5"
                                                      strokeWidth={3}
                                                   />
                                                </Checkbox.Indicator>
                                             </Checkbox.Root>
                                          </FormControl>
                                          <Label htmlFor={field.name}>
                                             Search for context in this story
                                          </Label>
                                          <Caption
                                             as="p"
                                             className="col-start-2"
                                          >
                                             This will allow your AI Buddy to
                                             search the internet for context
                                             related to this story, this will
                                             help in providing more accurate
                                             information.
                                          </Caption>
                                       </Aligner>
                                       <FormDescription></FormDescription>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                              {/* story timeline */}
                              {/* from */}
                              <FormField
                                 control={form.control}
                                 name="from"
                                 render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                       <FormLabel>Story Timeline </FormLabel>
                                       <Popover>
                                          <PopoverTrigger asChild>
                                             <Button.Root
                                                id="date"
                                                variant={"outlined"}
                                                intent="gray"
                                                className={cn(
                                                   "w-full justify-start text-left font-normal",
                                                   !date &&
                                                      "text-muted-foreground",
                                                )}
                                             >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date?.from ? (
                                                   date.to ? (
                                                      <>
                                                         {format(
                                                            date.from,
                                                            "LLL dd, y",
                                                         )}{" "}
                                                         -{" "}
                                                         {format(
                                                            date.to,
                                                            "LLL dd, y",
                                                         )}
                                                      </>
                                                   ) : (
                                                      format(
                                                         date.from,
                                                         "LLL dd, y",
                                                      )
                                                   )
                                                ) : (
                                                   <span>Pick a date</span>
                                                )}
                                             </Button.Root>
                                          </PopoverTrigger>
                                          <PopoverContent
                                             className="w-auto p-0"
                                             align="start"
                                          >
                                             <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                disabled={(date) =>
                                                   date > new Date() ||
                                                   date < new Date("1900-01-01")
                                                }
                                                onSelect={(range) => {
                                                   if (!range) return;
                                                   form.setValue(
                                                      "from",
                                                      range.from,
                                                   );
                                                   form.setValue(
                                                      "to",
                                                      range.to,
                                                   );
                                                }}
                                                numberOfMonths={2}
                                             />
                                          </PopoverContent>
                                       </Popover>
                                       <FormDescription>
                                          This will help your AI Buddy narrow
                                          down the search results.
                                       </FormDescription>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <Dialog.Actions className="-mx-[--card-padding] border-t px-[--card-padding] pt-[--card-padding]">
                                 <Dialog.Close asChild>
                                    <Button.Root
                                       variant="outlined"
                                       intent="gray"
                                       size="sm"
                                       type="button"
                                    >
                                       <Button.Label>Cancel</Button.Label>
                                    </Button.Root>
                                 </Dialog.Close>
                                 <Button.Root
                                    variant="solid"
                                    intent="primary"
                                    size="sm"
                                    type="submit"
                                 >
                                    <Button.Label>
                                       {isPending
                                          ? "Creating..."
                                          : "Create Story"}
                                    </Button.Label>
                                 </Button.Root>
                              </Dialog.Actions>
                           </fieldset>
                        </form>
                     </div>
                  </Form>
               </Dialog.Content>
            </Dialog.Portal>
         </Dialog.Root>
      </>
   );
};

export default AddStorySheet;
