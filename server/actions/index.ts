"use server";

import { addYoutubeVideoSchema, uploadFileSchema } from "@/lib/schemas.ts";
import { authedProcedure } from "./procedures";
import { CallbackUrl, createClient } from "@deepgram/sdk";
import { getIdFromVideoLink, getYoutubeVideoDetails } from "@/lib/helpers";
import { db } from "@/lib/db";
import { inngest } from "@/inngest";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getXataClient } from "@/lib/xata";

const dg = createClient(process.env.DEEPGRAM_API_KEY!);

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
   .input(uploadFileSchema, { type: "formData" })
   .handler(async ({ input, ctx }) => {
      const { pdf } = input;
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
               name: encodeURI(pdf.name),
               mediaType: pdf.type,
               size: pdf.size,
               base64Content: "",
               uploadUrlTimeout: 3600,
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
