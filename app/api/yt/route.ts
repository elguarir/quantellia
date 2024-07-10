import { extractYTVideoId, getYoutubeVideo } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   const { url } = await request.json();
   try {
      const id = extractYTVideoId(url);
      return NextResponse.json(await getYoutubeVideo(id));
   } catch (error) {
    console.log(error)
   }
   return NextResponse.json({ error: "Invalid youtube link" }, { status: 400 });
}
