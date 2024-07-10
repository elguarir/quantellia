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
