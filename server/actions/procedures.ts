import { currentUser } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";

export const authedProcedure = createServerActionProcedure().handler(
   async () => {
      const user = await currentUser();
      if (!user)
         throw new Error("You must be logged in to perform this action");

      return {
         user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
         },
      };
   },
);
