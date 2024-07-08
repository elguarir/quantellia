import { Button } from "@/tailus-ui/button";
import { Bell } from "lucide-react";
import { Text, Title } from "@/tailus-ui/typography";
import Popover from "@/tailus-ui/popover";
import Tabs from "@/tailus-ui/tabs";
import {
   BERNARD_AVATAR,
   GLODIE_AVATAR,
   MESCHAC_AVATAR,
   THEO_AVATAR,
} from "./const";
import { ChatLink } from "./chat-link";

const ChatLinks = () => {
   return (
      <Tabs.Root defaultValue="all" className="-mx-3 space-y-4">
         <Tabs.List
            className="w-fit gap-2 px-3 [--tabs-radius:9999px]"
            variant="plain"
            triggerVariant="softToSoft"
            size="sm"
            intent="primary"
         >
            <Tabs.Trigger value="all">All</Tabs.Trigger>
            <Tabs.Trigger value="unread">Unread</Tabs.Trigger>
            <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
         </Tabs.List>
         <Tabs.Content value="all" className="space-y-1">
            <ChatLink
               userName="Méschac Irung"
               avatar={MESCHAC_AVATAR}
               lastMessage="Hello, how are you doing today?"
               date="12:00 PM"
               link="#"
            />
            <ChatLink
               userName="Bernard Ng"
               avatar={BERNARD_AVATAR}
               lastMessage="We're live 🚀"
               date="24 May"
               link="#"
            />
            <ChatLink
               isUnread
               userName="Théo Balick"
               avatar={THEO_AVATAR}
               lastMessage="Good news ! I'll be working on the CLI this week"
               date="20 May"
               link="#"
            />
         </Tabs.Content>
         <Tabs.Content value="unread" className="space-y-1">
            <ChatLink
               isUnread
               userName="Théo Balick"
               avatar={THEO_AVATAR}
               lastMessage="Good news ! I'll be working on the CLI this week"
               date="20 May"
               link="#"
            />
         </Tabs.Content>
         <Tabs.Content value="archived" className="space-y-1">
            <ChatLink
               userName="Glodie Lukose"
               avatar={GLODIE_AVATAR}
               lastMessage="Hello, how are you doing today?"
               date="12:00 PM"
               link="#"
            />
         </Tabs.Content>
      </Tabs.Root>
   );
};

export const Notifications = () => (
   <Popover.Root>
      <Popover.Trigger asChild>
         <div className="relative">
            <span className="absolute right-1 top-1 block size-1.5 rounded-full bg-danger-600 dark:bg-danger-400"></span>
            <Button.Root size="md" variant="ghost" intent="gray">
               <Button.Label hidden>Notifications</Button.Label>
               <Button.Icon type="only">
                  <Bell />
               </Button.Icon>
            </Button.Root>
         </div>
      </Popover.Trigger>
      <Popover.Content
         mixed
         sideOffset={6}
         align="end"
         className="w-[24rem]"
         data-shade="925"
      >
         <div className="mb-6">
            <Title size="base" as="h3" weight="medium">
               Notifications
            </Title>
            <div className="flex items-center justify-between gap-6">
               <Text size="sm">You have 3 new notifications</Text>
               <Button.Root
                  size="xs"
                  variant="ghost"
                  intent="primary"
                  className="-mr-2"
               >
                  <Button.Label>Mark all as read</Button.Label>
               </Button.Root>
            </div>
         </div>
         <div className="-mb-3">
            <ChatLinks />
         </div>
      </Popover.Content>
   </Popover.Root>
);
