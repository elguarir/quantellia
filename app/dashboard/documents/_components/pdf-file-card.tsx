"use client";
import React, { useState } from "react";
import { Document, File as PdfDoc } from "@prisma/client";
import { Caption, Title } from "@/components/tailus-ui/typography";
import DropdownMenu from "@/components/tailus-ui/dropdown-menu";
import { Button } from "@/components/tailus-ui/button";
import { DotsVerticalIcon, SizeIcon } from "@radix-ui/react-icons";
import Badge from "@/components/tailus-ui/badge";
import SeparatorRoot from "@/components/tailus-ui/separator";
import {
   Archive,
   Download,
   File,
   LucideLoader,
   MessageCircleMore,
   Trash,
} from "lucide-react";
import { getDownloadUrl, performActionOnDocument } from "@/server/actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { getStatus } from "@/lib/constants";
import { decodeDoubleEncodedUriComponent, formatBytes } from "@/lib/utils";
import { useRouter } from "next/navigation";
import AlertDialog from "@/components/tailus-ui/alert-dialog";
import Tooltip from "@/components/tailus-ui/tooltip";
import Link from "next/link";
import { CutePdfIcon } from "@/components/icons";

interface PdfFileCardProps {
   pdfFile: PdfDoc;
   status: Document["status"];
   docId: string;
   archived: boolean;
}

const PdfFileCard = ({
   pdfFile,
   status,
   docId,
   archived,
}: PdfFileCardProps) => {
   const [open, setOpen] = useState(false);
   const router = useRouter();

   const {
      execute: performAction,
      isPending,
      error,
   } = useServerAction(performActionOnDocument, {
      onSuccess: ({ data }) => {
         if (data.action === "delete") {
            toast.success(data.message);
         }
         setOpen(false);
         router.refresh();
      },
      onError: ({ err }) => {
         toast.error(err.message);
      },
   });
   const { execute: generateDownloadUrl, isPending: isGenerating } =
      useServerAction(getDownloadUrl, {
         onSuccess: ({ data }) => {
            window.open(data.signedUrl, "_blank");
         },
         onError: ({ err }) => {
            toast.error(err.message);
         },
      });

   const statusDetails = getStatus(status);
   const Icon = statusDetails.icon;

   return (
      <div className="flex h-full min-h-40 flex-col">
         <header className="space-y-1">
            <div className="flex w-full items-start justify-between gap-2">
               <div className="flex flex-col space-y-1">
                  <div className="line-clamp-1">
                     <Title as="h3" className="text-lg">
                        <>
                           {decodeDoubleEncodedUriComponent(pdfFile?.pdf?.name)}
                        </>
                     </Title>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge
                        variant="outlined"
                        intent="gray"
                        size="sm"
                        className="inline-flex gap-1 whitespace-nowrap rounded-md py-0.5"
                     >
                        <SizeIcon className="size-4" />
                        <span className="text-xs">
                           {formatBytes(pdfFile?.pdf?.size, {
                              sizeType: "normal",
                              decimals: 2,
                           })}
                        </span>
                     </Badge>
                  </div>
               </div>
               <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                     <Button.Root
                        variant="outlined"
                        intent="gray"
                        size="xs"
                        className="min-w-7"
                     >
                        <Button.Icon type="only">
                           <DotsVerticalIcon />
                        </Button.Icon>
                     </Button.Root>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                     <DropdownMenu.Content
                        mixed
                        sideOffset={5}
                        className="w-44"
                        align="end"
                     >
                        <DropdownMenu.Item>
                           <DropdownMenu.Icon>
                              <File />
                           </DropdownMenu.Icon>
                           Details
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                           <DropdownMenu.Icon>
                              <MessageCircleMore />
                           </DropdownMenu.Icon>
                           Chat
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />

                        <DropdownMenu.Item
                           onClick={() => {
                              toast.promise(
                                 performAction({
                                    action: archived ? "restore" : "archive",
                                    docId,
                                 }),
                                 {
                                    loading: "Archiving...",
                                    success(data) {
                                       const [res, err] = data;
                                       return res?.message;
                                    },
                                    error() {
                                       return error?.message;
                                    },
                                 },
                              );
                           }}
                        >
                           <DropdownMenu.Icon>
                              <Archive />
                           </DropdownMenu.Icon>
                           {archived ? "Unarchive" : "Archive"}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                           intent="danger"
                           onClick={() => {
                              setOpen(true);
                           }}
                        >
                           <DropdownMenu.Icon>
                              <Trash />
                           </DropdownMenu.Icon>
                           Delete
                        </DropdownMenu.Item>
                     </DropdownMenu.Content>
                  </DropdownMenu.Portal>
               </DropdownMenu.Root>
            </div>
            <div className="flex flex-wrap items-center gap-2"></div>
         </header>
         <SeparatorRoot className="my-4" />
         <div className="group relative flex flex-col h-full min-h-[175px] flex-1 items-center justify-center overflow-hidden rounded-lg sm:min-h-[225px]">
            <CutePdfIcon className="w-1/3" />
            <Caption size={"sm"}>
               Go to the details page to preview the document.
            </Caption>
         </div>
         <SeparatorRoot className="my-4" />
         <footer className="flex items-center justify-between">
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  generateDownloadUrl({ docId });
               }}
            >
               <div className="flex items-center gap-2">
                  <Tooltip.Root delayDuration={100}>
                     <Tooltip.Trigger asChild>
                        <Button.Root
                           type="submit"
                           variant="ghost"
                           intent="gray"
                           size="sm"
                           disabled={isGenerating}
                        >
                           <Button.Icon type="only">
                              {isGenerating ? (
                                 <LucideLoader className="animate-spin" />
                              ) : (
                                 <Download />
                              )}
                           </Button.Icon>
                        </Button.Root>
                     </Tooltip.Trigger>
                     <Tooltip.Portal>
                        <Tooltip.Content>Download the document</Tooltip.Content>
                     </Tooltip.Portal>
                  </Tooltip.Root>
                  <Button.Root variant="ghost" intent="gray" size="sm">
                     <Link
                        href={`/dashboard/documents/${docId}`}
                        className="text-sm"
                     >
                        <Button.Label>View details</Button.Label>
                     </Link>
                  </Button.Root>
               </div>
            </form>
            <div>
               <Badge
                  // shut up typescript
                  intent={statusDetails.intent as any}
                  size="md"
                  variant="soft"
                  className="flex items-center space-x-1 rounded-md"
               >
                  <Icon className="size-4" />
                  <span>{statusDetails.label}</span>
               </Badge>
            </div>
         </footer>
         <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Portal>
               <AlertDialog.Overlay />
               <AlertDialog.Content className="max-w-md" data-shade="glassy">
                  <AlertDialog.Title>
                     Are you absolutely sure?
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-2">
                     This action cannot be undone. This will permanently delete
                     the document.
                  </AlertDialog.Description>
                  <AlertDialog.Actions className="justify-end">
                     <fieldset
                        className="flex w-full items-center justify-end gap-2"
                        disabled={isPending}
                     >
                        <AlertDialog.Cancel asChild>
                           <Button.Root
                              variant="outlined"
                              intent="gray"
                              size="sm"
                           >
                              <Button.Label>Cancel</Button.Label>
                           </Button.Root>
                        </AlertDialog.Cancel>
                        <Button.Root
                           variant="solid"
                           intent="danger"
                           size="sm"
                           disabled={isPending}
                           className="min-w-fit px-3"
                           onClick={() => {
                              performAction({ action: "delete", docId });
                           }}
                        >
                           {isPending && (
                              <Button.Icon className="mr-1" type="only">
                                 <LucideLoader className="animate-spin" />
                              </Button.Icon>
                           )}
                           <Button.Label>
                              {isPending ? "Hang on..." : "Yes, Delete"}
                           </Button.Label>
                        </Button.Root>
                     </fieldset>
                  </AlertDialog.Actions>
               </AlertDialog.Content>
            </AlertDialog.Portal>
         </AlertDialog.Root>
      </div>
   );
};

export default PdfFileCard;
