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
import { generateUploadUrl, sendFileForProcessing } from "@/server/actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { cn, formatBytes, uploadFile } from "@/lib/utils";
import { Dropzone } from "@/components/dropezone";
import useUpload from "@/hooks/use-upload";
import Card from "@/components/tailus-ui/card";
import { Text, Title } from "@/components/tailus-ui/typography";
import { PdfIcon } from "@/components/icons";
import Badge from "@/components/tailus-ui/badge";
import * as ResizablePanel from "@/components/resizable-panel";
import Progress from "@/components/tailus-ui/progress";
import { Loader2 } from "lucide-react";
import { ComponentProps, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MAX_FILE_SIZE } from "@/lib/constants";
interface UploadFileFormProps {
   onSuccess?: () => void;
}

const formSchema = z.object({
   pdf: z
      .instanceof(File, { message: "Required" })
      .refine((value) => value.size < MAX_FILE_SIZE, {
         message: "File is too large",
      })
      .refine((value) => value.type.startsWith("application/pdf"), {
         message: "Only PDF files are allowed.",
      }),
});

export default function UploadFileForm(p: UploadFileFormProps) {
   const [progress, setProgress] = useState<number | null>(null);
   const [isUploading, setIsUploading] = useState(false);
   const [isUploaded, setIsUploaded] = useState(false);
   const { execute: generateUrl, isPending: isGenerating } =
      useServerAction(generateUploadUrl);
   const { execute: sendForProcessing, isPending: isSendingForProcessing } =
      useServerAction(sendFileForProcessing);
   const isPending = isGenerating || isSendingForProcessing || isUploading;

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const [data, err] = await generateUrl({
         name: values.pdf.name,
         size: values.pdf.size,
         type: values.pdf.type,
      });
      if (err) {
         toast.error(err.message);
         return;
      }

      if (data) {
         setIsUploading(true);
         await uploadFile({
            file: values.pdf,
            url: data.url,
            onError: (err) => {
               toast.error(err.message);
            },
            onProgress: (progress) => {
               setProgress(progress);
            },
            onSuccess: async () => {
               setIsUploading(false);
               setProgress(null);
               setIsUploaded(true);
               const [res, err] = await sendForProcessing({
                  docId: data.docId,
               });
               if (err) {
                  toast.error(err.message);
                  return;
               }
               toast.success("Document uploaded successfully, processing...");
               p.onSuccess?.();
            },
         });
      }
   };

   return (
      <Form {...form}>
         <div className="grid space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <fieldset className="space-y-5" disabled={isPending}>
                  <FormField
                     control={form.control}
                     name="pdf"
                     render={({ field }) => (
                        <FormItem>
                           <div className="flex w-full items-center justify-between gap-1">
                              <FormLabel>Document</FormLabel>
                              <Button.Root
                                 size="xs"
                                 variant="ghost"
                                 intent="gray"
                                 type="button"
                                 onClick={() => {
                                    form.reset();
                                 }}
                                 className={
                                    field.value ? "visible" : "invisible"
                                 }
                              >
                                 <Button.Label>Clear</Button.Label>
                              </Button.Root>
                           </div>
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
                                       value={
                                          field.value ? "selected" : "select"
                                       }
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
                                                      className="line-clamp-1"
                                                   >
                                                      {field?.value?.name}
                                                   </Title>
                                                   <Text size="sm">
                                                      {formatBytes(
                                                         field?.value?.size ||
                                                            0,
                                                         {
                                                            decimals: 2,
                                                            sizeType: "normal",
                                                         },
                                                      )}
                                                   </Text>
                                                </div>
                                             </div>
                                             {isUploading &&
                                                progress !== null && (
                                                   <div className="w-full">
                                                      <Progress.Root
                                                         className="w-full"
                                                         data-orientation="vertical"
                                                         value={progress}
                                                         size="sm"
                                                         variant="soft"
                                                      >
                                                         <Progress.Indicator
                                                            intent="primary"
                                                            loading="primary"
                                                            complete="success"
                                                            style={{
                                                               transform: `translateX(-${100 - progress}%)`,
                                                            }}
                                                         />
                                                      </Progress.Root>
                                                   </div>
                                                )}
                                             {isUploading ||
                                                (isUploaded && (
                                                   <Badge
                                                      className="absolute right-2 top-1 flex items-center justify-center rounded-full p-0.5"
                                                      variant="solid"
                                                      intent={
                                                         isUploaded
                                                            ? "success"
                                                            : "gray"
                                                      }
                                                   >
                                                      {isUploaded ? (
                                                         <CheckIcon className="size-4" />
                                                      ) : (
                                                         <Loader2 className="size-4 animate-spin" />
                                                      )}
                                                   </Badge>
                                                ))}
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
                           {isGenerating
                              ? "Creating document..."
                              : isUploading
                                ? "Uploading..."
                                : isSendingForProcessing
                                  ? "Processing..."
                                  : "Upload"}
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
