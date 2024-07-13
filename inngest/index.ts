import {
   processVideo,
   completeTranscription,
   processFile,
   completeFileProcessing,
   generateTranscriptEmbeddings,
} from "./functions";

export const functions = [
   processVideo,
   completeTranscription,
   processFile,
   completeFileProcessing,
   generateTranscriptEmbeddings,
];

export { inngest } from "./client";
