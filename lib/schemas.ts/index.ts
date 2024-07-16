import z from "zod";
import { MAX_FILE_SIZE } from "../constants";

export const addYoutubeVideoSchema = z.object({
   link: z
      .string()
      .url()
      .refine(
         (value) => {
            try {
               let regex =
                  /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
               return Boolean(regex.exec(value)![3]);
            } catch (error) {
               return false;
            }
         },
         { message: "Invalid youtube link" },
      ),
});
// 20MB

export const uploadFileSchema = z.object({
   // pdf: z
   //    .instanceof(File, { message: "Required" })
   //    .refine((value) => value.size < MAX_FILE_SIZE, {
   //       message: "File is too large",
   //    })
   //    .refine((value) => value.type.startsWith("application/pdf"), {
   //       message: "Only PDF files are allowed.",
   //    }),
   name: z.string().min(1),
   size: z.number().min(1).max(MAX_FILE_SIZE, { message: "File is too large" }),
   type: z
      .string()
      .regex(/^application\/pdf$/, { message: "Only PDF files are allowed." }),
   docId: z.string().optional(),
});

export const sendMessageSchema = z.object({
   message: z.string().min(1, { message: "Message is required" }),
});

export const newStorySchema = z.object({
   title: z.string().min(1, { message: "Title is required" }),
   description: z.string().optional(),
   searchForContext: z.boolean().optional().default(true),
   from: z.date().optional(),
   to: z.date().optional(),
});
