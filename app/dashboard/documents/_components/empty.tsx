import React from "react";
import { Caption, Kbd, Text, Title } from "@/components/tailus-ui/typography";
import Card from "@/components/tailus-ui/card";
import { FileText, Globe, PenTool, Puzzle, Rocket } from "lucide-react";
import BookBriefcase from "@/components/illustration/book-briefcase";
import { YoutubeIcon, YTFilledIcon } from "@/components/icons";

const EmptyDocuments = () => {
   const documentTypes = [
      {
         icon: <FileText className="size-6" />,
         title: "PDF Documents",
         description:
            "Upload and analyze PDF files for in-depth research and reference.",
      },
      {
         icon: <YTFilledIcon className="size-6" />,
         title: "YouTube Videos",
         description:
            "Extract insights from YouTube content with automatic transcription.",
      },
      {
         icon: <Globe className="size-6" />,
         title: "Web Pages",
         description:
            "Save and process web articles for easy access and analysis.",
      },
   ];

   return (
      <div className="flex flex-col space-y-12">
         <div className="flex h-full w-full flex-col items-center justify-center space-y-5">
            <div className="w-1/2 xl:w-1/5">
               <BookBriefcase />
            </div>
            <div className="text-balance text-center max-w-prose">
               <Title as="h1" size="2xl">
                  Your document library is empty
               </Title>
               <Caption>
                  Start by adding documents to fuel your research and stories.
                  Click the "New Document" button or press <Kbd>N</Kbd> to get
                  started.
               </Caption>
            </div>
         </div>
         <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {documentTypes.map((docType, index) => (
               <Card key={index} variant="mixed" className="p-4">
                  <div className="flex items-start gap-4">
                     <div className="text-primary">{docType.icon}</div>
                     <div>
                        <Title
                           as="h2"
                           size="lg"
                           weight="medium"
                           className="mb-2"
                        >
                           {docType.title}
                        </Title>
                        <Caption>{docType.description}</Caption>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default EmptyDocuments;
