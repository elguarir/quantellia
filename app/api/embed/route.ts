import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { embed } from "ai";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { embedTexts } from "@/lib/helpers";

// const google = createGoogleGenerativeAI();
const replicate = new Replicate({
   auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
   const { texts } = await request.json();

   let output = await embedTexts(texts)

   return NextResponse.json(output);
}

async function loadPDF(url: string | URL | Request) {
   const response = await fetch(url);
   const data = await response.blob();
   const loader = new WebPDFLoader(data);
   const docs = await loader.load();
   console.log({ docs });
   return docs;
}
