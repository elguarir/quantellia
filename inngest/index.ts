import {
   processVideo,
   completeTranscription,
   processFile,
   completeFileProcessing,
   generateTranscriptEmbeddings,
   getInitialStoryContext
} from "./functions";

export const functions = [
   processVideo,
   completeTranscription,
   processFile,
   completeFileProcessing,
   generateTranscriptEmbeddings,
   getInitialStoryContext
];

export { inngest } from "./client";
