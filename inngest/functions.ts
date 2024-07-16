import { dg } from "@/lib/deepgram";
import { inngest } from "./client";
import { embedTexts, getYoutubeVideoUrl } from "@/lib/helpers";
import { getIdFromVideoLink } from "@/lib/utils";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { CallbackUrl } from "@deepgram/sdk";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { getXataClient } from "@/lib/xata";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { exa } from "@/lib/exa-ai";

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
                  paragraphs: true,
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
                  your task is to summarize for this video transcript, ensure to use markdown formmating, you can also use the <mark></mark> to highlight important keywords, only if necessary (don't over use it) in the summary you should include the main points of the video, in a nice and concise manner. also incldue a TLDR section at the end, in a nice bullet point format.
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
               paragraphs: event.data.paragraphs,
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
                  title: true,
                  channel: true,
                  description: true,
                  views: true,
                  length: true,
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

         await db.chat.upsert({
            where: {
               docId: transcript.video.docId,
            },
            create: {
               docId: transcript.video.docId,
               messages: [
                  {
                     role: "assistant",
                     content: `Hi, I'm your AI Buddy, I'm here to help you with any questions you have about the video, feel free to ask me anything and I'll do my best to help you out.`,
                  },
               ],
            },
            update: {},
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

      const [dbDoc, dbFile] = await Promise.all([
         xata.db.documents
            .filter({ id: event.data.docId })
            .select(["*"])
            .getFirstOrThrow(),
         xata.db.uploaded_files
            .filter({ doc_id: { id: event.data.docId } })
            .select(["*"])
            .getFirstOrThrow(),
      ]);

      await step.run("generate-summary", async () => {
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
                  your task is to create a summary for this PDF document about what it's about, ensure to use markdown formmating, you can also use the <mark></mark> to highlight important keywords, only if necessary (don't over use it) in the summary you should include the main points of the document, in a nice and concise manner, if for some reason no context is provided you can tell the user that
                  the document is not clear enough to generate a summary.
               `,
            messages: [
               {
                  role: "system",
                  content: `The first 10000 characters from the pdf: ${event.data.content
                     .map((c) => c.text)
                     .join("\n")
                     .slice(0, 10000)}`, // only send the first 1000 characters
               },
            ],
         });

         const updated = await dbFile.update({
            summary: result.text,
         });
         return updated?.toSerializable();
      });

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

         await xata.db.chats.create({
            doc_id: event.data.docId,
            messages: [
               {
                  role: "assistant",
                  content: `Hi, I'm your AI Buddy, I'm here to help you with any questions you have about this PDF document, feel free to ask me anything and I'll do my best to help you out.`,
               },
            ],
         });

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


export const getInitialStoryContext = inngest.createFunction(
   { id: "get-initial-story-context" },
   { event: "story.getInitialContext" },
   async ({ event, step, db }) => {
      const story = await db.story.findUnique({
         where: {
            id: event.data.storyId,
         },
         select: {
            id: true,
            title: true,
         },
      });

      if (!story) {
         throw new Error("Story not found");
      }

      const initialContext = await step.run(
         "search-the-web-for-context",
         async () => {
            const { results } = await exa.searchAndContents(event.data.title, {
               type: "auto",
               useAutoprompt: true,
               numResults: 5,
               text: true,
               highlights: {
                  highlightsPerUrl: 4,
                  numSentences: 3,
               },
            });

            const formmatedResults = results.map((result, idx) => {
               return `
            - result: ${idx + 1}
            - title: ${result.title}
            - url: ${result.url}
            - author: ${result.author}
            - summary: ${result.text}
            - text: ${result.text}
            - highlights: ${result.highlights.map((highlight) => {
               return `- ${highlight}\n`;
            })}
            `;
            });

            return `
         initial context for the user's story: ${event.data.title}, this is the top search results on google.
         ${formmatedResults.join("\n")}
         `;
         },
      );

      const result = await step.run("update-story-context", async () => {
         return await db.story.update({
            where: {
               id: story.id,
            },
            data: {
               initialContext: initialContext,
               readyToStart: true,
            },
         });
      });

      return {
         success: true,
         result,
      };
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
