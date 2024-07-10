import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { embed } from "ai";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

// const google = createGoogleGenerativeAI();
const replicate = new Replicate({
   auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
   const { texts } = await request.json();

   const output = await replicate.run(
      "replicate/all-mpnet-base-v2:b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305",
      {
         input: {
            text_batch: JSON.stringify(texts),
         },
      },
   );

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
