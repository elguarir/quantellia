import { EventSchemas, Inngest, InngestMiddleware } from "inngest";
import { db } from "@/lib/db";
import { Paragraph } from "@/prisma";

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

type ProcessFile = {
   data: {
      docId: string;
   };
};

type ProcessWebPage = {
   data: {
      docId: string;
   };
};

type TranscriptionCompleted = {
   data: {
      request_id: string;
      text: string;
      confidence: number;
      paragraphs: Paragraph[]
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

type generateTranscriptEmbeddings = {
   data: {
      text: string;
      request_id: string;
   };
};

type completeFileProcessing = {
   data: {
      docId: string;
      content: {
         text: string;
         metadata: {
            totalPages: number;
            pageNumber: number;
            lines: {
               from: number | null;
               to: number | null;
            };
         };
      }[];
   };
};

type Events = {
   "video.process": ProcessVideo;
   "file.process": ProcessFile;
   "webpage.process": ProcessWebPage;
   "file.completeProcessing": completeFileProcessing;
   "transcription.complete": TranscriptionCompleted;
   "transcript.generateSummary": generateTranscriptSummary;
   "transcript.generateEmbeddings": generateTranscriptEmbeddings;
};

// Create a client to send and receive events
export const inngest = new Inngest({
   id: "quantellia",
   middleware: [prismaMiddleware],
   schemas: new EventSchemas().fromRecord<Events>(),
});
