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
         name: "youtube/video.process",
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
      const { file } = input;
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

      const createdFile = await xata.db.files.create(
         {
            doc_id: doc.id,
            file: {
               name: encodeURI(file.name),
               mediaType: file.type,
               size: file.size,
               base64Content: "",
            },
         },
         ["file.uploadUrl"],
      );

      if (!createdFile.file.uploadUrl) {
         throw new Error("Failed to create upload url");
      }

      return {
         success: true,
         url: createdFile.file.uploadUrl,
         docId: doc.id,
      };
   });
