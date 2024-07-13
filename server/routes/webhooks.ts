import { Hono } from "hono";
import type { SyncPrerecordedResponse } from "@deepgram/sdk";
import { inngest } from "@/inngest";

const webhooks = new Hono().post("/deepgram", async (c) => {
   const body = (await c.req.json()) as SyncPrerecordedResponse;
   console.log(`Received webhook from Deepgram: ${body.metadata.request_id}`);

   const res = await inngest.send({
      name: "transcription.complete",
      data: {
         text:
            body.results.channels[0].alternatives[0].paragraphs?.transcript ??
            body.results.channels[0].alternatives[0].transcript,
         request_id: body.metadata.request_id,
         confidence: body.results.channels[0].alternatives[0].confidence,
      },
   });
   return c.json({ success: true, ids: res.ids });
});

export default webhooks;
