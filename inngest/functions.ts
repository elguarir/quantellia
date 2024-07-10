import { inngest } from "./client";

export const messageSent = inngest.createFunction(
   { id: "message-sent" },
   { event: "transcription/new.started" },
   async ({ event, step, db }) => {
      
   },
);
