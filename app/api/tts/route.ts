// import { dg } from "@/lib/deepgram";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
export const dynamic = "force-dynamic";
import { createClient } from "@deepgram/sdk";

export const dg = createClient(process.env.DEEPGRAM_API_KEY);

export async function POST(request: NextRequest) {
   try {
      const { result, error } = await dg.listen.prerecorded.transcribeFile(
         fs.readFileSync(process.cwd() + "/audio.mp3"),
         {
            callback:
               "https://webhook.site/f186a208-dbf8-4de6-b98a-0dad2c72e36f",
            model: "nova-2",
            smart_format: true,
         },
      );
      return NextResponse.json({ result, error });
   } catch (error) {
      if (error instanceof Error)
         return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
