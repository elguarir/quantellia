"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import Input from "@/components/tailus-ui/input";
import { addYoutubeVideoSchema } from "@/lib/schemas.ts";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/tailus-ui/button";
import { addYoutubeVideo } from "@/server/actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";

interface AddWebPageProps {
   onSuccess?: () => void;
}
export default function AddWebPage(p: AddWebPageProps) {
   const router = useRouter();

   const { execute, isPending } = useServerAction(addYoutubeVideo, {
      onSuccess: ({ data }) => {
         toast.success(
            "Youtube video added successfully, it will be proccesed soon",
         );
         p.onSuccess?.();
      },
      onError: ({ err }) => {
         toast.error(err.message);
      },
   });
   const form = useForm<z.infer<typeof addYoutubeVideoSchema>>({
      resolver: zodResolver(addYoutubeVideoSchema),
   });

   const onSubmit = async (values: z.infer<typeof addYoutubeVideoSchema>) => {
      execute(values);
   };

   return (
      <Form {...form}>
         <div className="grid space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <fieldset className="space-y-5" disabled={isPending}>
                  <FormField
                     control={form.control}
                     name="link"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Youtube Video Link</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="https://www.youtube.com/watch?v=xvFZjo5PgG0"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <SheetFooter className="flex items-center justify-end gap-2">
                     <SheetClose asChild>
                        <Button.Root size="sm" variant="ghost" intent="gray">
                           <Button.Label>Cancel</Button.Label>
                        </Button.Root>
                     </SheetClose>

                     <Button.Root size="sm" intent="primary" typeof="submit">
                        {isPending && (
                           <Button.Icon type="leading">
                              <Spinner size="sm" className="animate-spin" />
                           </Button.Icon>
                        )}
                        <Button.Label>
                           {isPending ? "Adding..." : "Add Video"}
                        </Button.Label>
                     </Button.Root>
                  </SheetFooter>
               </fieldset>
            </form>
         </div>
      </Form>
   );
}
