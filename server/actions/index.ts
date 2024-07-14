"use server";

import { addYoutubeVideoSchema, uploadFileSchema } from "@/lib/schemas.ts";
import { authedProcedure } from "./procedures";
import {  getYoutubeVideoDetails } from "@/lib/helpers";
import { getIdFromVideoLink } from "@/lib/utils";
import { db } from "@/lib/db";
import { inngest } from "@/inngest";
import { z } from "zod";
import { getXataClient } from "@/lib/xata";
import { XataError } from "@xata.io/client";

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
