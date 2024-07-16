"use client";
import { Button } from "@/components/tailus-ui/button";
import Popover from "@/components/tailus-ui/popover";
import { Text, Title } from "@/components/tailus-ui/typography";
import { Paperclip, X } from "lucide-react";
import { useState } from "react";

const UploadAttachement = () => {
   const [open, setOpen] = useState(false);

   return (
      <Popover.Root open={open} onOpenChange={setOpen}>
         <Popover.Trigger asChild>
            <Button.Root size="sm" variant="ghost" intent="gray">
               <Button.Icon type="only" size="sm">
                  <Paperclip />
               </Button.Icon>
               <Button.Label className="sr-only">
                  Upload attachment
               </Button.Label>
            </Button.Root>
         </Popover.Trigger>
         <Popover.Portal>
            <Popover.Content
               mixed
               className="z-10 mb-2 max-w-7xl"
               align="start"
            >
               <Title size="base" as="div" weight="medium">
                  Add Attachments
               </Title>
               <Text size={"sm"}>
                  Upload pdfs to add more context to your story.
               </Text>
               <Popover.Close asChild>
                  <Button.Root variant="ghost" size="xs" intent="gray">
                     <Button.Icon type="only" size="xs">
                        <X />
                     </Button.Icon>
                  </Button.Root>
               </Popover.Close>
            </Popover.Content>
         </Popover.Portal>
      </Popover.Root>
   );
};

export default UploadAttachement;
