import { EventSchemas, Inngest, InngestMiddleware } from "inngest";
import { db } from "@/lib/db";

// make Prisma available in the Inngest functions
const prismaMiddleware = new InngestMiddleware({
   name: "Prisma Middleware",
   init() {
      return {
         onFunctionRun(ctx) {
            return {
               transformInput(ctx) {
                  return {
                     // Anything passed via `ctx` will be merged with the function's arguments
                     ctx: {
                        db,
                     },
                  };
               },
            };
         },
      };
   },
});

type ProcessVideo = {
   data: {
      docId: string;
   };
};

type TranscriptionCompleted = {
   data: {
      request_id: string;
      text: string;
      confidence: number;
   };
};

type generateTranscriptSummary = {
   data: {
      title: string;
      description: string | null;
      channel: string;
      text: string | null;
   };
};

type Events = {
   "youtube/video.process": ProcessVideo;
   "transcription.completed": TranscriptionCompleted;
   "transcript.generateSummary": generateTranscriptSummary;
};

// Create a client to send and receive events
export const inngest = new Inngest({
   id: "fluent-script",
   middleware: [prismaMiddleware],
   schemas: new EventSchemas().fromRecord<Events>(),
});
