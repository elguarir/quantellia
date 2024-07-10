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
import { generateTranscript } from "@/actions";

export default function AddYoutubeVideo() {
   const form = useForm<z.infer<typeof addYoutubeVideoSchema>>({
      resolver: zodResolver(addYoutubeVideoSchema),
   });

   const onSubmit = async (values: z.infer<typeof addYoutubeVideoSchema>) => {
      console.log(values);
      const [data, err] = await generateTranscript(values);

      console.log("data", data);
      console.log("err", err);
   };

   return (
      <Form {...form}>
         <div className="grid space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                     <Button.Label>Save</Button.Label>
                  </Button.Root>
               </SheetFooter>
            </form>
         </div>
      </Form>
   );
}
