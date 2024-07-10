import { db } from "@/lib/db";
import { createWebhooksHandler } from "@brianmmdev/clerk-webhooks-handler";

const handler = createWebhooksHandler({
   secret: process.env.CLERK_WEBHOOK_SECRET as string,
   onUserCreated: async (user) => {
      const primaryEmail = user.email_addresses[0].email_address;
      await db.user.create({
         data: {
            id: user.id,
            email: primaryEmail,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: user.image_url,
         },
      });
   },
   onUserUpdated: async (user) => {
      const primaryEmail = user.email_addresses[0].email_address;
      await db.user.update({
         where: { id: user.id },
         data: {
            email: primaryEmail,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: user.image_url,
         },
      });
   },
   onUserDeleted: async (user) => {
      await db.user.delete({ where: { id: user.id } });
   },
});

export const POST = handler.POST;
