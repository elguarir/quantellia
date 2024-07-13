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
   { event: "transcription.completed" },
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
            model: google("models/gemini-1.5-flash-latest"),
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
      });

      return {
         success: true,
         updated,
      };
   },
);

export const processFile = inngest.createFunction(
   { id: "process-file" },
   { event: "file.process" },
   async ({ event, step, db }) => {
      console.log("Processing file", event.data.docId);
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

      const texts = await step.run("load-pdf-file", async () => {
         console.log("Loading PDF file");
         await dbDoc.update({
            status: "IN_PROGRESS",
         });

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
         return splitDocs.map((doc) => {
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
      });

      // embed all the chunks and save them
      return await step.run("process-documents", async () => {
         console.log("Processing documents");
         const output = await embedTexts(texts.map((doc) => doc.text));
         const formattedOutput = texts.map((doc, index) => {
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
