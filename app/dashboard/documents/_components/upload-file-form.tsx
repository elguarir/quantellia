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
import { uploadFileSchema } from "@/lib/schemas.ts";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/tailus-ui/button";
import { generateUploadUrl } from "@/server/actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { cn, formatBytes } from "@/lib/utils";
import { Dropzone } from "@/components/dropezone";
import useUpload from "@/hooks/use-upload";
import Card from "@/components/tailus-ui/card";
import { Text, Title } from "@/components/tailus-ui/typography";
import { PdfIcon } from "@/components/icons";
import Badge from "@/components/tailus-ui/badge";
import * as ResizablePanel from "@/components/resizable-panel";
import Progress from "@/components/tailus-ui/progress";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";
import { motion } from "framer-motion";
interface UploadFileFormProps {
   onSuccess?: () => void;
}

export default function UploadFileForm(p: UploadFileFormProps) {
   const { file, onChange, isUploading, startUpload, clear } = useUpload(
      "single",
      {
         autoUpload: false,
      },
   );
   const { execute: generateUrl, isPending } = useServerAction(
      generateUploadUrl,
      {
         onSuccess: ({ data }) => {
            console.log(data);
         },
         onError: ({ err }) => {
            console.log(err);
         },
      },
   );

   const form = useForm<z.infer<typeof uploadFileSchema>>({
      resolver: zodResolver(uploadFileSchema),
   });

   const onSubmit = async (values: z.infer<typeof uploadFileSchema>) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
         formData.append(key, value);
      });
      const [data, err] = await generateUrl(formData);
      if (data) {
         console.log("startUpload");
         form.setValue("docId", data.docId);
         startUpload(data.url);
      }
   };

   console.log(file, isUploading);

   return (
      <Form {...form}>
         <div className="grid space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <fieldset className="space-y-5" disabled={isPending}>
                  <FormField
                     control={form.control}
                     name="file"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Document</FormLabel>
                           <Dropzone
                              options={{
                                 accept: {
                                    "application/pdf": [],
                                 },
                                 multiple: false,
                                 noDrag: false,
                                 noClick: true,
                                 maxSize: 20000000, // 20MB
                              }}
                              onError={(err) => {
                                 toast.error(err.message);
                              }}
                              onSelect={(files) => {
                                 field.onChange(files[0]);
                                 onChange(files[0]);
                              }}
                           >
                              {({
                                 getRootProps,
                                 getInputProps,
                                 isDragAccept,
                                 isDragReject,
                              }) => (
                                 <>
                                    <ResizablePanel.Root
                                       value={file ? "selected" : "select"}
                                    >
                                       <ResizablePanel.Content value="selected">
                                          <Card
                                             variant="outlined"
                                             className="relative flex flex-col space-y-1 px-3 py-2"
                                          >
                                             <div className="flex items-center gap-2">
                                                <div>
                                                   <PdfIcon className="w-10" />
                                                </div>
                                                <div>
                                                   <Title
                                                      as="h2"
                                                      size="lg"
                                                      weight="medium"
                                                   >
                                                      {file?.file.name}
                                                   </Title>
                                                   <Text size="sm">
                                                      {formatBytes(
                                                         file?.file.size || 0,
                                                         {
                                                            decimals: 2,
                                                            sizeType: "normal",
                                                         },
                                                      )}
                                                   </Text>
                                                </div>
                                             </div>
                                             {file?.status === "uploading" && (
                                                <div className="w-full">
                                                   <Progress.Root
                                                      className="w-full"
                                                      data-orientation="vertical"
                                                      value={file?.progress}
                                                      size="sm"
                                                      variant="soft"
                                                   >
                                                      <Progress.Indicator
                                                         intent="primary"
                                                         loading="primary"
                                                         complete="success"
                                                         style={{
                                                            transform: `translateX(-${100 - file?.progress}%)`,
                                                         }}
                                                      />
                                                   </Progress.Root>
                                                </div>
                                             )}
                                             {(file?.status === "done" ||
                                                file?.status ===
                                                   "uploading") && (
                                                <Badge
                                                   className="absolute right-2 top-2 flex items-center justify-center rounded-full p-0.5"
                                                   variant="solid"
                                                   intent={
                                                      file?.status === "done"
                                                         ? "success"
                                                         : "gray"
                                                   }
                                                >
                                                   {file?.status === "done" ? (
                                                      <CheckIcon className="size-4" />
                                                   ) : (
                                                      <Loader2 className="size-4 animate-spin" />
                                                   )}
                                                </Badge>
                                             )}
                                          </Card>
                                       </ResizablePanel.Content>
                                       <ResizablePanel.Content value="select">
                                          <div
                                             {...getRootProps()}
                                             className={cn(
                                                "flex h-44 w-full items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors duration-200 focus-visible:border-solid focus-visible:border-primary focus-visible:outline-none",
                                                isDragAccept &&
                                                   "border-success-600 bg-success-600/20 text-success-600",
                                                isDragReject &&
                                                   "border-danger-600 bg-danger-600/20 text-danger-600",
                                             )}
                                          >
                                             <FormControl>
                                                <input {...getInputProps()} />
                                             </FormControl>
                                             <div className="text-center">
                                                <span className="font-[450]">
                                                   Drag & Drop or Click to
                                                   Upload
                                                </span>
                                                <span className="block text-xs">
                                                   only PDF files are allowed,
                                                   max 20MB
                                                </span>
                                             </div>
                                          </div>
                                       </ResizablePanel.Content>
                                    </ResizablePanel.Root>
                                 </>
                              )}
                           </Dropzone>
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
                           {isPending ? "Uploading..." : "Upload Document"}
                        </Button.Label>
                     </Button.Root>
                  </SheetFooter>
               </fieldset>
            </form>
         </div>
      </Form>
   );
}

function CheckIcon(props: ComponentProps<"svg">) {
   return (
      <svg
         {...props}
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
         strokeWidth={3}
      >
         <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
               delay: 0.2,
               type: "tween",
               ease: "easeOut",
               duration: 0.3,
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
         />
      </svg>
   );
}
