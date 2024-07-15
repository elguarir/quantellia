import { CoreMessage } from "ai";

export interface Sentence {
   text: string;
   start: number;
   end: number;
}

export interface Paragraph {
   sentences: Sentence[];
   start: number;
   end: number;
   num_words: number;
   speaker?: number;
}

declare global {
   namespace PrismaJson {
      // you can use classes, interfaces, types, etc.
      type XataFile = {
         name: string;
         size: number;
         version: number;
         mediaType: string;
         uploadKey: string;
         storageKey: string;
         enablePublicUrl: boolean;
         signedUrlTimeout: number;
         uploadUrlTimeout: number;
      };

      type TranscriptParagraphs = Paragraph[]

      type DocChat = CoreMessage[]
   }
}
