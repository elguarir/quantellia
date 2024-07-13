import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   const { text } = await request.json();
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
          your task is to summarize for this video transcript, ensure to use markdown formmating, in the summary you should include the main points of the video, in a nice and concise manner. also incldue a TLDR section at the end, in a nice bullet point format.
       `,
      messages: [
         {
            role: "user",
            content: `
                video transcript: ${text}`,
         },
      ],
   });

   return NextResponse.json(result);
}
