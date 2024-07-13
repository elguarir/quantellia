"use client";
import React, { useEffect } from "react";
import Card from "@/components/tailus-ui/card";
import PdfFileCard from "./pdf-file-card";
import VideoCard from "./video-card";
import { Prisma } from "@prisma/client";
import { Types } from "@/lib/constants";
import { useRouter } from "next/navigation";

type Props = {
   initialDocs: Prisma.DocumentGetPayload<{
      include: {
         file: true;
         webPage: true;
         youtubeVideo: true;
      };
   }>[];
   filterValue: Types[];
};

const DocumentsGrid = ({ initialDocs, filterValue }: Props) => {
   const filteredDocs = initialDocs.filter((doc) => {
      if (filterValue.length === 0) return true;
      const possibleTypes = filterValue.map((f) => {
         switch (f) {
            case Types.YoutubeVideo:
               return "YoutubeVideo";
            case Types.File:
               return "File";
            case Types.WebPage:
               return "WebPage";
         }
      });

      if (possibleTypes.includes(doc.type)) return true;
   });
   const router = useRouter();

   useEffect(() => {
      // here we're checking the status of first document(last added) if the status is not "PROCESSED" then we keep refreshing the page, that way we don't keep polling the server if not nessecary !
      const handle = setInterval(() => {
         if (filteredDocs.length === 0) return;
         if (filteredDocs[0].status !== "PROCESSED") {
            router.refresh();
         }
      }, 1000);

      return () => clearInterval(handle);
   }, [filteredDocs]);
   return (
      <>
         {filteredDocs.map((doc) => (
            <Card className="p-[1.2rem]">
               {doc.type === "YoutubeVideo" && (
                  <VideoCard
                     video={doc.youtubeVideo}
                     status={doc.status}
                     docId={doc.id}
                     archived={Boolean(doc.archivedAt)}
                  />
               )}
               {doc.type === "File" && doc.file && (
                  <PdfFileCard
                     docId={doc.id}
                     pdfFile={doc.file}
                     status={doc.status}
                     archived={Boolean(doc.archivedAt)}
                  />
               )}
            </Card>
         ))}
      </>
   );
};

export default DocumentsGrid;
