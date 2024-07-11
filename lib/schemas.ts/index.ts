import z from "zod";

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
const MAX_FILE_SIZE = 20000000;

export const uploadFileSchema = z.object({
   file: z
      .instanceof(File)
      .refine((value) => value.size < MAX_FILE_SIZE, {
         message: "File is too large",
      })
      .refine((value) => value.type.startsWith("application/pdf"), {
         message: "Only PDF files are allowed.",
      }),
   docId: z.string().optional(),
});
