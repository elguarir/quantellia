import { dg } from "@/lib/deepgram";
import { inngest } from "./client";
import {
   embedTexts,
   getIdFromVideoLink,
   getYoutubeVideoUrl,
} from "@/lib/helpers";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { CallbackUrl } from "@deepgram/sdk";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { getXataClient } from "@/lib/xata";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

export const processVideo = inngest.createFunction(
   { id: "process-video" },
   { event: "video.process" },
   async ({ event, step, db }) => {
      const video = await db.youtubeVideo.findUnique({
         where: {
            docId: event.data.docId,
         },
         include: {
            document: true,
         },
      });

      if (!video) {
         throw new Error("Video not found");
      }

      if (video.document.status !== "PENDING") {
         return;
      }

      /**
       * get a direct link to the video
       */
      const videoUrl = await step.run("get-youtube-video-url", async () => {
         const id = getIdFromVideoLink(video.link);
         return await getYoutubeVideoUrl(id);
      });

      /**
       * send the video to deepgram for transcription
       */
      const transcript = await step.run("transcribe-video", async () => {
         const { error, result } =
            await dg.listen.prerecorded.transcribeUrlCallback(
               { url: videoUrl },
               new CallbackUrl(process.env.DEEPGRAM_CALLBACK_URL!),
               {
                  smart_format: true,
                  model: "nova-2",
                  punctuate: true,
               },
            );

         if (error) {
            throw new Error(error.message);
         }

         const updated = await db.youtubeVideo.update({
            where: {
               id: video.id,
            },
            data: {
               document: {
                  update: {
                     status: "IN_PROGRESS",
                  },
               },
               transcript: {
                  create: {
                     id: result.request_id,
                  },
               },
            },
            select: {
               id: true,
               transcript: {
                  select: {
                     id: true,
                  },
               },
            },
         });

         return updated;
      });

      return transcript;
   },
);

export const completeTranscription = inngest.createFunction(
   { id: "complete-transcription" },
   { event: "transcription.complete" },
   async ({ event, step, db }) => {
      const transcript = await db.transcript.findUnique({
         where: {
            id: event.data.request_id,
         },
         select: {
            id: true,
            video: {
               select: {
                  id: true,
                  title: true,
                  description: true,
                  channel: true,
               },
            },
         },
      });

      if (!transcript) {
         throw new Error("Transcript not found");
      }

      const updated = await step.run("update-transcript", async () => {
         console.log(`Generating summary for video: ${transcript.id}`);
         const result = await generateText({
            model: google("models/gemini-1.5-flash-latest", {
               safetySettings: [
                  {
                     category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                     threshold: "BLOCK_NONE",
                  },
                  {
                     category: "HARM_CATEGORY_HARASSMENT",
                     threshold: "BLOCK_NONE",
                  },
                  {
                     category: "HARM_CATEGORY_HATE_SPEECH",
                     threshold: "BLOCK_NONE",
                  },
                  {
                     category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                     threshold: "BLOCK_NONE",
                  },
               ],
            }),
            system: `You are a helpful assistant,
                  your task is to summarize for this video transcript, ensure to use markdown formmating, in the summary you should include the main points of the video, in a nice and concise manner. also incldue a TLDR section at the end, in a nice bullet point format.
               `,
            messages: [
               {
                  role: "user",
                  content: `
                        video title: ${transcript.video.title}\n
                        video description: ${transcript.video.description}\n
                        channel name: ${transcript.video.channel}\n
                        video transcript: ${event.data.text}`,
               },
            ],
         });

         return await db.transcript.update({
            where: {
               id: transcript.id,
            },
            data: {
               text: event.data.text,
               confidence: event.data.confidence,
               summary: result.text,
            },
         });
      });

      await step.sendEvent("generate-embeddings", {
         name: "transcript.generateEmbeddings",
         data: { request_id: transcript.id, text: event.data.text },
      });

      return {
         success: true,
         updated,
      };
   },
);

export const generateTranscriptEmbeddings = inngest.createFunction(
   { id: "generate-transcript-embeddings" },
   { event: "transcript.generateEmbeddings" },
   async ({ event, step, db }) => {
      const transcript = await db.transcript.findUnique({
         where: {
            id: event.data.request_id,
         },
         select: {
            id: true,
            video: {
               select: {
                  docId: true,
               },
            },
         },
      });

      if (!transcript) {
         throw new Error("Transcript not found");
      }

      const output = await step.run("embed-transcript", async () => {
         const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
         });

         // split the text instead into chunks
         const docOutput = await splitter.splitDocuments([
            new Document({ pageContent: event.data.text }),
         ]);

         const embeds = await embedTexts([
            ...docOutput.map((doc) => doc.pageContent),
         ]);
         const res = await db.vectors.createManyAndReturn({
            data: docOutput.map((doc, index) => {
               return {
                  content: doc.pageContent,
                  embedding: embeds[index],
                  metadata: {},
                  docId: transcript.video.docId,
               };
            }),
         });

         await db.transcript.update({
            where: {
               id: transcript.id,
            },
            data: {
               video: {
                  update: {
                     document: {
                        update: {
                           status: "PROCESSED",
                        },
                     },
                  },
               },
            },
         });

         return res;
      });

      return {
         success: true,
         count: output.length,
      };
   },
);

/**
 * in here I could have used a step but somehow on the first step gets executed, that is why I separated the embed part into a separate function
 */
export const processFile = inngest.createFunction(
   { id: "process-file" },
   { event: "file.process" },
   async ({ event, step, db }) => {
      const xata = getXataClient();

      const [dbFile, dbDoc] = await Promise.all([
         xata.db.uploaded_files
            .filter({ doc_id: { id: event.data.docId } })
            .select(["doc_id.*", "pdf.signedUrl", "pdf.name"])
            .getFirstOrThrow(),
         xata.db.documents
            .filter({ id: event.data.docId })
            .select(["*"])
            .getFirstOrThrow(),
      ]);
      if (!dbFile || !dbDoc) {
         console.log("File not found");
         throw new Error("File not found");
      }

      if (dbDoc.status !== "PENDING") {
         return;
      }

      await step.run("process-file", async () => {
         await dbDoc.update({
            status: "IN_PROGRESS",
         });
         try {
            const url = dbFile.pdf.signedUrl;
            const response = await fetch(url!);
            const data = await response.blob();
            const loader = new WebPDFLoader(data);
            const docs = await loader.load();
            const textSplitter = new RecursiveCharacterTextSplitter({
               chunkSize: 1000,
               chunkOverlap: 200,
            });
            // split the document into chunks
            const splitDocs = await textSplitter.splitDocuments(docs);
            const formatted = splitDocs.map((doc) => {
               return {
                  text: doc.pageContent,
                  metadata: {
                     totalPages: parseInt(doc.metadata.pdf.totalPages),
                     pageNumber: parseInt(doc.metadata.loc.pageNumber),
                     lines: {
                        from: parseInt(doc.metadata.loc.lines.from) ?? null,
                        to: parseInt(doc.metadata.loc.lines.to) ?? null,
                     },
                  },
               };
            });

            // somehow this doesn't work, the event doesn't get sent ):
            // await step.sendEvent("complete-file-processing", {
            //    name: "file.completeProcessing",
            //    data: { content: texts, docId: event.data.docId },
            // });
            return await inngest.send({
               name: "file.completeProcessing",
               data: {
                  docId: event.data.docId,
                  content: formatted,
               },
            });
         } catch (error) {
            if (error instanceof Error) {
               await dbDoc.update({
                  status: "FAILED",
               });
               throw new Error("Invalid PDF file");
            }
         }
      });
   },
);

export const completeFileProcessing = inngest.createFunction(
   { id: "complete-file-processing" },
   { event: "file.completeProcessing" },
   async ({ event, step, db }) => {
      console.log("complete file processing");
      // embed all the chunks and save them
      const xata = getXataClient();

      const [dbDoc] = await Promise.all([
         xata.db.documents
            .filter({ id: event.data.docId })
            .select(["*"])
            .getFirstOrThrow(),
      ]);

      await step.run("process-documents", async () => {
         const output = await embedTexts(
            event.data.content.map((doc) => doc.text),
         );

         const formattedOutput = event.data.content.map((doc, index) => {
            return {
               content: doc.text,
               embedding: output[index],
               metadata: doc.metadata,
               doc_id: event.data.docId,
            };
         });

         const records = await xata.db.vectors.create(formattedOutput);
         await dbDoc.update({
            status: "PROCESSED",
         });

         return {
            success: true,
            count: records.length,
         };
      });
   },
);

/**
 * 
model File {
  id             String   @id @default(dbgenerated("('file_'::text || (xata_private.xid())::text)"))
  docId          String   @unique @map("doc_id")
  xata_id        String   @unique(map: "files__pgroll_new_xata_id_key") @default(dbgenerated("('rec_'::text || (xata_private.xid())::text)"))
  xata_version   Int      @default(0)
  xata_createdat DateTime @default(now()) @db.Timestamptz(6)
  xata_updatedat DateTime @default(now()) @db.Timestamptz(6)
  file           Json
  document       Document @relation(fields: [docId], references: [id], onDelete: Cascade)

  @@map("files")
}

model Vectors {
  id        String   @id @default(dbgenerated("('vec_'::text || (xata_private.xid())::text)"))
  docId     String   @unique @map("doc_id")
  content   String
  embedding Float[]  @db.Real
  metadata  Json
  document  Document @relation(fields: [docId], references: [id], onDelete: Cascade)

  xata_id        String   @unique(map: "vectors__pgroll_new_xata_id_key") @default(dbgenerated("('rec_'::text || (xata_private.xid())::text)"))
xata_version   Int      @default(0)
  xata_createdat DateTime @default(now()) @db.Timestamptz(6)
  xata_updatedat DateTime @default(now()) @db.Timestamptz(6)

  @@map("vectors")
}
 */
