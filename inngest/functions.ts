import { dg } from "@/lib/deepgram";
import { inngest } from "./client";
import { getIdFromVideoLink, getYoutubeVideoUrl } from "@/lib/helpers";
import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { CallbackUrl } from "@deepgram/sdk";

export const processVideo = inngest.createFunction(
   { id: "process-video" },
   { event: "youtube/video.process" },
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
               new CallbackUrl(
                  `https://hqdwdccotydf.share.zrok.io/api/v1/webhooks/deepgram`,
               ),
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
                           status: "COMPLETED",
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
