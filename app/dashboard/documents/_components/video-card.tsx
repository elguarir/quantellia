"use client";
import React, { useState } from "react";
import { Document, YoutubeVideo } from "@prisma/client";
import { Title } from "@/components/tailus-ui/typography";
import Link from "next/link";
import DropdownMenu from "@/components/tailus-ui/dropdown-menu";
import { Button } from "@/components/tailus-ui/button";
import { DotsVerticalIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

import {
   Archive,
   BarChart,
   File,
   LucideLoader,
   MessageCircleMore,
   Trash,
} from "lucide-react";

import SeparatorRoot from "@/components/tailus-ui/separator";
import Badge from "@/components/tailus-ui/badge";
import { getStatus } from "@/lib/constants";
import { useServerAction } from "zsa-react";
import { performActionOnDocument } from "@/server/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AlertDialog from "@/components/tailus-ui/alert-dialog";

interface VideoCardProps {
   video: YoutubeVideo | null;
   status: Document["status"];
   docId: string;
   archived: boolean;
}

const VideoCard = ({ video, status, docId, archived }: VideoCardProps) => {
   const statusDetails = getStatus(status);
   const Icon = statusDetails.icon;
   const [open, setOpen] = useState(false);
   const router = useRouter();

   const {
      execute: performAction,
      isPending,
      error,
   } = useServerAction(performActionOnDocument, {
      onSuccess: ({ data }) => {
         setOpen(false);
         router.refresh();
      },
      onError: ({ err }) => {
         toast.error(err.message);
      },
   });

   return (
      <div className="flex flex-col">
         <header className="space-y-1">
            <div className="flex w-full items-start justify-between gap-2">
               <div className="line-clamp-2">
                  <Title as="h3" className="text-lg">
                     {video?.title}
                  </Title>
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
                                    loading: archived
                                       ? "Restoring..."
                                       : "Archiving...",
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
            <div className="flex flex-wrap items-center gap-2">
               <Badge
                  variant="outlined"
                  intent="gray"
                  size="sm"
                  className="inline-flex gap-1 whitespace-nowrap rounded-md py-0.5"
               >
                  <BarChart className="size-4" />
                  <span className="text-xs">
                     {video?.views?.toLocaleString()} views
                  </span>
               </Badge>
               <span className="size-1.5 rounded-full bg-foreground/70" />
               <Badge size="sm" className="inline-flex rounded-md py-0.5">
                  <span className="text-xs">{video?.channel}</span>
               </Badge>
            </div>
         </header>
         <SeparatorRoot className="my-4" />
         <div className="group relative overflow-hidden rounded-lg">
            <Button.Root
               size="xs"
               intent="gray"
               variant="outlined"
               asChild
               className="absolute right-1 top-1 z-10 rounded-md px-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
               <a href={video?.link ?? "#"} target="_blank">
                  <Button.Icon type="only">
                     <ExternalLinkIcon />
                  </Button.Icon>
               </a>
            </Button.Root>
            <img
               src={video?.thumb}
               className="aspect-video transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
         </div>
         <SeparatorRoot className="my-4" />
         <footer className="flex items-center justify-between">
            <Button.Root variant="ghost" intent="gray" size="sm">
               <Link href={`/dashboard/documents/${docId}`} className="text-sm">
                  <Button.Label>View details</Button.Label>
               </Link>
            </Button.Root>
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
                  <AlertDialog.Actions>
                     <fieldset
                        className="flex w-full items-center justify-end gap-2"
                        disabled={isPending}
                     >
                        <AlertDialog.Cancel asChild>
                           <Button.Root
                              variant="outlined"
                              intent="gray"
                              size="sm"
                              className="transition-colors"
                           >
                              <Button.Label>Cancel</Button.Label>
                           </Button.Root>
                        </AlertDialog.Cancel>
                        <Button.Root
                           variant="solid"
                           intent="danger"
                           size="sm"
                           onClick={() => {
                              toast.promise(
                                 performAction({ action: "delete", docId }),
                                 {
                                    loading: "Deleting...",
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
                           className="min-w-fit px-3 disabled:dark:text-gray-300"
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

export default VideoCard;
