import { db } from "@/lib/db";
import { getXataClient } from "@/lib/xata";
import { auth } from "@clerk/nextjs/server";
import { Hono } from "hono";

const documents = new Hono()
   .get("/", async (c) => {
      const { userId } = auth();
      if (!userId) {
         return auth().redirectToSignIn({
            returnBackUrl: "/dashboard/documents",
         });
      }
      const docs = await db.document.findMany({
         where: {
            userId,
         },
         include: { file: true, youtubeVideo: true, webPage: true },
         orderBy: {
            xata_createdat: "desc",
         },
      });

      return c.json(docs);
   })
   .get("/:id", async (c) => {
      const { userId } = auth();
      if (!userId) {
         return auth().redirectToSignIn({
            returnBackUrl: "/dashboard/documents",
         });
      }
      const doc = await db.document.findUnique({
         where: {
            id: c.req.param().id,
            userId,
         },
         include: { file: true, youtubeVideo: true, webPage: true },
      });

      if (!doc || doc.userId !== userId) {
         return c.json({ error: "Document not found" }, 404);
      }

      return c.json(doc);
   })
   .get("pdf/:id", async (c) => {
      /**
       * a hacky way to bypass cors errors from xata
       */

      const { userId } = auth();
      if (!userId) {
         return auth().redirectToSignIn({
            returnBackUrl: "/dashboard/documents",
         });
      }

      const xata = getXataClient();
      let pdfData = await xata.db.uploaded_files
         .filter({ doc_id: { id: c.req.param("id") } })
         .select(["doc_id.*", "pdf.signedUrl", "pdf.name"])
         .getFirstOrThrow();

      const blob = await fetch(pdfData?.pdf.signedUrl as string).then((res) =>
         res.blob(),
      );
      const buffer = await blob.arrayBuffer();
      return c.body(buffer, {
         headers: {
            "Content-Type": "application/pdf",
         },
      });
   });

export default documents;
