"use server";

import { addYoutubeVideoSchema, uploadFileSchema } from "@/lib/schemas.ts";
import { authedProcedure } from "./procedures";
import { embedTexts, getYoutubeVideoDetails } from "@/lib/helpers";
import { formatBytes, getIdFromVideoLink } from "@/lib/utils";
import { db } from "@/lib/db";
import { inngest } from "@/inngest";
import { z } from "zod";
import { getXataClient } from "@/lib/xata";
import { XataError } from "@xata.io/client";
import { CoreMessage, streamText } from "ai";
import { Prisma } from "@prisma/client";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export const addYoutubeVideo = authedProcedure
   .createServerAction()
   .input(addYoutubeVideoSchema)
   .handler(async ({ input, ctx }) => {
      const id = getIdFromVideoLink(input.link);
      const video = await getYoutubeVideoDetails(id);

      const res = await db.youtubeVideo.create({
         data: {
            title: video.title,
            description: video.description,
            channel: video.channel,
            length: video.length,
            views: video.views,
            thumb: video.thumb,
            link: input.link,
            document: {
               create: {
                  type: "YoutubeVideo",
                  user: {
                     connect: {
                        id: ctx.user.id,
                     },
                  },
               },
            },
         },
      });

      await inngest.send({
         name: "video.process",
         data: {
            docId: res.docId,
         },
      });

      return {
         success: true,
         id: res.id,
      };
   });

export const generateUploadUrl = authedProcedure
   .createServerAction()
   .input(uploadFileSchema)
   .handler(async ({ input, ctx }) => {
      const { name, size, type, docId } = input;
      const xata = getXataClient();

      const doc = await db.document.create({
         data: {
            type: "File",
            user: {
               connect: {
                  id: ctx.user.id,
               },
            },
         },
      });

      const createdFile = await xata.db.uploaded_files.create(
         {
            doc_id: doc.id,
            pdf: {
               name: encodeURI(name),
               mediaType: type,
               size: size,
               base64Content: "",
               uploadUrlTimeout: 3600,
               signedUrlTimeout: 3600 * 4, // 4 hours
            },
         },
         ["pdf.uploadUrl"],
      );

      if (!createdFile.pdf.uploadUrl) {
         throw new Error("Failed to create upload url");
      }

      return {
         success: true,
         url: createdFile.pdf.uploadUrl,
         docId: doc.id,
      };
   });

export const sendFileForProcessing = authedProcedure
   .createServerAction()
   .input(
      z.object({
         docId: z.string(),
      }),
   )
   .handler(async ({ input }) => {
      const doc = await db.document.findUnique({
         where: {
            id: input.docId,
         },
      });

      if (!doc) {
         throw new Error("Document not found, or hasen't been uploaded yet");
      }

      const { ids } = await inngest.send({
         name: "file.process",
         data: {
            docId: doc.id,
         },
      });

      return {
         success: true,
         ids,
      };
   });

export const getDownloadUrl = authedProcedure
   .createServerAction()
   .input(
      z.object({
         docId: z.string(),
      }),
   )
   .handler(async ({ input, ctx }) => {
      const xata = getXataClient();
      try {
         const file = await xata.db.uploaded_files
            .filter({
               doc_id: { id: input.docId, user_id: ctx.user.id },
            })
            .select(["*", "pdf.signedUrl"])
            .getFirstOrThrow();

         if (file.pdf.size === 0) {
            throw new Error("File has no content, remove it and re-upload");
         }

         console.log(file.pdf);
         return {
            success: true,
            signedUrl: file.pdf.signedUrl,
         };
      } catch (error) {
         if (error instanceof XataError) {
            throw new Error("File not found");
         }
         throw error;
      }
   });

export const performActionOnDocument = authedProcedure
   .createServerAction()
   .input(
      z.object({
         docId: z.string(),
         action: z.union([
            z.literal("archive"),
            z.literal("delete"),
            z.literal("restore"),
         ]),
      }),
   )
   .handler(async ({ input, ctx }) => {
      const doc = await db.document.findUnique({
         where: {
            id: input.docId,
            userId: ctx.user.id,
         },
      });

      if (!doc) {
         throw new Error("Document not found");
      }

      try {
         if (input.action === "archive") {
            await db.document.update({
               where: {
                  id: input.docId,
               },
               data: {
                  archivedAt: new Date(),
               },
            });
            return {
               success: true,
               action: input.action,

               message: "Document archived successfully",
            };
         } else if (input.action === "delete") {
            await db.document.delete({
               where: {
                  id: input.docId,
               },
            });

            return {
               success: true,
               action: input.action,
               message: "Document deleted successfully",
            };
         } else if (input.action === "restore") {
            await db.document.update({
               where: {
                  id: input.docId,
               },
               data: {
                  archivedAt: null,
               },
            });

            return {
               success: true,
               action: input.action,
               message: "Document restored successfully",
            };
         }
      } catch (error) {
         throw new Error("Failed to perform action");
      }
   });

export const answerQuestion = authedProcedure
   .createServerAction()
   .input(
      z.object({
         docId: z.string(),
         chatId: z.string(),
         messages: z.array(z.any()),
      }),
   )
   .handler(async ({ input, ctx }) => {
      const messages: CoreMessage[] = input.messages;

      try {
         const chat = await db.chat.findUnique({
            where: {
               id: input.chatId,
               docId: input.docId,
               doc: {
                  userId: ctx.user.id,
               },
            },
            include: {
               doc: {
                  include: {
                     youtubeVideo: {
                        include: {
                           transcript: true,
                        },
                     },
                     webPage: true,
                     file: true,
                  },
               },
            },
         });
         const xata = getXataClient();
         // const results = await xata.

         if (!chat) {
            throw new Error(
               "Document hasen't been processed yet, in order to answer questions",
            );
         }

         const question = messages[messages.length - 1];

         const [embedding] = await embedTexts([question.content as string]);
         const relevantContext = await xata.db.vectors.vectorSearch(
            "embedding",
            embedding,
            {
               size: 10,
               filter: {
                  doc_id: chat.docId,
               },
            },
         );

         console.log(
            `found {${relevantContext.records.length}} relevant context records\n context: ${relevantContext.records.map((c) => "- " + c.content).join("\n")}`,
         );

         const newMessages: CoreMessage[] = [
            {
               role: "system",
               content: getSystemMessageByType(chat),
            },
            ...input.messages,
            {
               role: "system",
               content: `
                  user's question: ${question.content}
                  context for the question:
                  ${relevantContext.records
                     .map((c) => `- ${c.content}`)
                     .join("\n")}
               `,
            },
         ];

         const result = await streamText({
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
            messages: newMessages,
            onFinish: async ({ text }) => {
               await db.chat.update({
                  where: {
                     id: input.chatId,
                     docId: input.docId,
                     doc: {
                        userId: ctx.user.id,
                     },
                  },
                  data: {
                     messages: [
                        ...messages,
                        {
                           role: "assistant",
                           content: text,
                        },
                     ],
                  },
               });
            },
         });

         const stream = createStreamableValue(result.textStream);
         return stream.value;
      } catch (error) {
         if (error instanceof Error) {
            // a weird way to do this, but i'm filtering any sensitive errors :D
            if (
               error.message ===
               "Document hasen't been processed yet, in order to answer questions"
            ) {
               throw new Error(error.message);
            } else {
               console.error(error);
               throw new Error("Failed to answer the question at this time");
            }
         }
      }
   });

export const clearConversation = authedProcedure
   .createServerAction()
   .input(
      z.object({
         docId: z.string(),
         chatId: z.string(),
      }),
   )
   .handler(async ({ input, ctx }) => {
      const chat = await db.chat.findUnique({
         where: {
            id: input.chatId,
            docId: input.docId,
            doc: {
               userId: ctx.user.id,
            },
         },
      });

      if (!chat) {
         throw new Error("Document not found");
      }

      const updated = await db.chat.update({
         where: {
            id: input.chatId,
            docId: input.docId,
            doc: {
               userId: ctx.user.id,
            },
         },
         data: {
            messages: [
               {
                  role: "assistant",
                  content: `Hi, I'm your AI Buddy, I'm here to help you with any questions you have about this PDF document, feel free to ask me anything and I'll do my best to help you out.`,
               },
            ],
         },
      });

      return {
         success: true,
         messages: updated.messages,
      };
   });

export const updateChatMessages = authedProcedure
   .createServerAction()
   .input(
      z.object({
         docId: z.string(),
         chatId: z.string(),
         messages: z.array(z.any()),
      }),
   )
   .handler(async ({ input, ctx }) => {
      const messages: CoreMessage[] = input.messages;

      const chat = await db.chat.update({
         where: {
            id: input.chatId,
            docId: input.docId,
            doc: {
               userId: ctx.user.id,
            },
         },
         data: {
            messages,
         },
      });
      if (!chat) {
         throw new Error(
            "Document hasen't been processed yet, in order to answer questions",
         );
      }

      return {
         success: true,
         messages,
      };
   });

// utils
type getSystemMessageByTypeProps = Prisma.ChatGetPayload<{
   include: {
      doc: {
         include: {
            youtubeVideo: {
               include: {
                  transcript: true;
               };
            };
            webPage: true;
            file: true;
         };
      };
   };
}>;

const getSystemMessageByType = (chat: getSystemMessageByTypeProps) => {
   switch (chat.doc.type) {
      case "YoutubeVideo":
         return `You are a helpful assistant,
                     Your task is to answer questions and provide information about the following youtube video,
                     make sure to provide accurate and helpful information, relevant parts of the video transcript will be provided to help answer the question.
                     if you know something that is not mentioned on the context provided about the question you can answer if you know the answer.
                     make sure the answer is properly formatted, use markdown to format the text (also lists, bold,italic, mark, formatting if needed).
                     make sure the answer is detailed if needed
                     here are some initial information about the video you're responsible for:
                     - title: ${chat.doc.youtubeVideo?.title}
                     - channel: ${chat.doc.youtubeVideo?.channel}
                     - description: ${chat.doc.youtubeVideo?.description}
                     - views: ${chat.doc.youtubeVideo?.views}
                     - length: ${chat.doc.youtubeVideo?.length}`;
      case "File":
         return `
         You are a helpful assistant,
         Your task is to answer questions and provide information about the following PDF document,
         make sure to provide accurate and helpful information, relevant parts of the document will be provided to help answer the question.
         if you know something that is not mentioned on the context provided about the question you can answer if you know the answer.
         make sure the answer is properly formatted, use markdown to format the text (also lists, bold,italic, mark, formatting if needed).
         make sure the answer is detailed if needed
         here are some initial information about the document you're responsible for:
         - name: ${chat.doc.file?.pdf.name}
         - size: ${formatBytes(chat.doc.file?.pdf.size ?? 0, { decimals: 2, sizeType: "normal" })}
         again, these are just information about the file itself, but when a user is  asking a question relevant context from the document will be provided, if the context is not enough, you can ask the user to rephrase the question, or simply tell them that you don't know the answer (first option is better).
         `;
      default:
         return `
          
         `;
   }
};
