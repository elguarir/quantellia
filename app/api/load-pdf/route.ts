import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function POST(request: NextRequest) {
   const { url } = await request.json();
   const docs = await loadPDF(url);
   const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
   });
   const splitDocs = await textSplitter.splitDocuments(docs);
   let formattedDocs = splitDocs.map((doc) => {
      return {
         text: doc.pageContent,
         metadata: {
            totalPages: parseInt(doc.metadata.pdf.totalPages),
            pageNumber: parseInt(doc.metadata.loc.pageNumber),
            lines: {
               from: parseInt(doc.metadata.loc.lines.from) ?? null,
               to: parseInt(doc.metadata.loc.lines.to) ?? null,
            },
         },
      };
   });

   return NextResponse.json(formattedDocs);
}

async function loadPDF(url: string | URL | Request) {
   const response = await fetch(url);
   const data = await response.blob();
   const loader = new WebPDFLoader(data);
   const docs = await loader.load();
   return docs;
}
