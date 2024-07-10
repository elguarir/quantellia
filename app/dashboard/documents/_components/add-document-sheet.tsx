"use client";

import { PlusIcon } from "@radix-ui/react-icons";
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
import { Button } from "@/components/tailus-ui/button";
import useKeypress from "@/hooks/use-key-press";
import Tabs from "@/tailus-ui/tabs";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { BrowserIcon, YoutubeIcon } from "@/components/icons";
import AddYoutubeVideo from "./add-yt-video-form";

export type DocumentType = "youtube" | "webpage" | "file";

const AddDocumentSheet = () => {
   const [isOpen, setOpen] = useState(false);
   const [docType, setDocType] = useState<DocumentType>("youtube");
   const underline = useRef<HTMLSpanElement>(null);

   useKeypress("n", (e) => {
      setOpen(true);
   });

   return (
      <Sheet open={isOpen} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button.Root size="sm">
               <Button.Label>New Document</Button.Label>
               <Button.Icon type="trailing">
                  <PlusIcon className="h-5 w-5" />
               </Button.Icon>
            </Button.Root>
         </SheetTrigger>
         <SheetContent
            side={"right"}
            className="sm:max-w-[30rem]"
            data-shade="925"
         >
            <SheetHeader>
               <SheetTitle>New Document</SheetTitle>
               <SheetDescription>
                  Upload a new document, make sure to choose the right category.
               </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-6 py-4">
               <div>
                  <Tabs.Root className="space-y-4" defaultValue="youtube">
                     <Tabs.List
                        variant="plain"
                        triggerVariant="softToSoft"
                        intent="primary"
                        size="sm"
                     >
                        <Tabs.Trigger
                           className="rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-opacity-50"
                           value="youtube"
                        >
                           <YoutubeIcon className="mr-2 size-4 opacity-50" />
                           Youtube
                        </Tabs.Trigger>
                        <Tabs.Trigger
                           className="rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-opacity-50"
                           value="file"
                        >
                           <Upload className="mr-2 size-4 opacity-50" />
                           Upload
                        </Tabs.Trigger>

                        <Tabs.Trigger
                           className="rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-opacity-50"
                           value="webpage"
                        >
                           <BrowserIcon className="mr-2 size-4 opacity-50" />
                           Web page
                        </Tabs.Trigger>
                     </Tabs.List>
                     <Tabs.Content
                        value="youtube"
                        className="text-[--caption-text-color]"
                     >
                        <AddYoutubeVideo />
                     </Tabs.Content>
                     <Tabs.Content
                        value="file"
                        className="text-[--caption-text-color]"
                     >
                        upload a file
                     </Tabs.Content>
                     <Tabs.Content
                        value="webpage"
                        className="text-[--caption-text-color]"
                     >
                        Insert an article/webpage link
                     </Tabs.Content>
                  </Tabs.Root>
               </div>
            </div>
         </SheetContent>
      </Sheet>
   );
};

export default AddDocumentSheet;
