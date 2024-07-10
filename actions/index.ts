"use server";

import { addYoutubeVideoSchema } from "@/lib/schemas.ts";
import { authedProcedure } from "./procedures";
import { CallbackUrl, createClient } from "@deepgram/sdk";
import { getIdFromVideoLink, getYoutubeVideo } from "@/lib/helpers";

const dg = createClient(process.env.DEEPGRAM_API_KEY!);

export const generateTranscript = authedProcedure
   .createServerAction()
   .input(addYoutubeVideoSchema)
   .handler(async ({ input, ctx }) => {
      const id = getIdFromVideoLink(input.link);
      const video = await getYoutubeVideo(id);
      console.log("video", video.url);
      const { error, result } =
         await dg.listen.prerecorded.transcribeUrlCallback(
            { url: video.url },
            new CallbackUrl(
               "https://webhook.site/f186a208-dbf8-4de6-b98a-0dad2c72e36f",
            ),
            {
               smart_format: true,
               model: "nova-2",
            },
         );

      if (error) {
         throw new Error(error.message);
      }

      return {
         result,
      };
   });
