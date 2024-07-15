import PageWrapper from "@/components/page-wrapper";
import {
   AccordianItem,
   AccordianTrigger,
   AccordianContent,
   AccordianRoot,
} from "@/components/tailus-ui/accordian";

import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { getIdFromVideoLink } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { BarChart, MessageCircleDashed } from "lucide-react";
import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import { TranscriptIcon, SparkIcon } from "@/components/icons";
import Badge from "@/components/tailus-ui/badge";
import {
   TooltipContent,
   TooltipPortal,
   TooltipRoot,
   TooltipTrigger,
} from "@/components/tailus-ui/tooltip";
import ChatSheet from "./_components/chat-sheet";

interface DashboardPageProps {
   params: {
      id: string;
   };
}

const DashboardPage = async (p: DashboardPageProps) => {
   const { userId } = auth();
   if (!userId) return auth().redirectToSignIn({ returnBackUrl: "/dashboard" });

   const doc = await db.document.findFirst({
      where: {
         userId,
         id: p.params.id,
      },
      include: {
         file: true,
         youtubeVideo: { include: { transcript: true } },
         webPage: true,
         chat: true,
      },
   });

   if (!doc) return notFound();
   const videoId = getIdFromVideoLink(doc.youtubeVideo?.link ?? "");
   console.log("chat", doc.chat);
   return (
      <PageWrapper
         title={
            <Breadcrumb>
               <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem>
                     <BreadcrumbLink href="/dashboard">
                        Dashboard
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbLink href="/dashboard/documents">
                        Documents
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage className="line-clamp-1">
                        {doc.youtubeVideo ? (
                           <>{doc.youtubeVideo.title}</>
                        ) : (
                           "Details"
                        )}
                     </BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="w-full divide-y p-6">
            <div className="flex items-center justify-between pb-6">
               <h1 className="text-2xl font-semibold">Details</h1>
               <div>
                  <ChatSheet docId={doc.id} initialMessages={doc.chat?.messages ?? []} chatId={doc.chat?.id} />
               </div>
            </div>
            <div className="flex w-full gap-x-6 gap-y-14 pt-10 max-xl:flex-col">
               <div className="flex w-full flex-col space-y-4 xl:w-2/3">
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                     <iframe
                        width="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={doc.youtubeVideo?.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        className="aspect-video"
                        allowFullScreen
                     ></iframe>
                  </div>
                  <div className="flex w-full flex-wrap items-start justify-between gap-2">
                     <h1 className="text-2xl font-semibold">
                        {doc.youtubeVideo?.title}
                     </h1>
                     <div className="flex items-center gap-2">
                        {doc.youtubeVideo?.views && (
                           <Badge variant="outlined" intent="gray">
                              <div className="flex items-center gap-2">
                                 <BarChart className="size-4" />
                                 <span>
                                    {doc.youtubeVideo?.views?.toLocaleString()}{" "}
                                    views
                                 </span>
                              </div>
                           </Badge>
                        )}
                        {doc.youtubeVideo?.channel && (
                           <Badge variant="soft" intent="primary">
                              {doc.youtubeVideo?.channel}
                           </Badge>
                        )}
                     </div>
                  </div>
               </div>
               <div className="w-full xl:w-1/3">
                  <AccordianRoot
                     type="single"
                     collapsible
                     variant="mixed"
                     defaultValue="transcript"
                     className="w-full max-w-prose"
                  >
                     <AccordianItem
                        className="px-0 data-[state=open]:z-0 [&>_h3]:px-[calc(var(--accordion-padding)+.5rem)]"
                        value={"summary"}
                        key={"summary"}
                     >
                        <AccordianTrigger>
                           <div className="flex items-center gap-2">
                              <SparkIcon className="size-5" />
                              <span>Summary</span>
                           </div>
                        </AccordianTrigger>
                        <AccordianContent className="prose-sm prose-violet overflow-y-auto whitespace-pre-wrap px-6 dark:prose-invert lg:prose-base prose-h2:mb-1 prose-h2:mt-3 prose-p:my-0 prose-ol:-mt-5 prose-ol:list-decimal prose-ul:my-0 prose-ul:list-disc prose-li:-my-1 prose-li:leading-tight xl:max-h-[calc(100dvh-360px)] [&_mark]:bg-primary-600 [&_mark]:text-primary-foreground">
                           <Markdown
                              content={
                                 doc.youtubeVideo?.transcript?.summary ?? ""
                              }
                           />
                        </AccordianContent>
                     </AccordianItem>
                     <AccordianItem
                        value={"transcript"}
                        key={"transcript"}
                        className="px-0 data-[state=open]:z-0 [&>_h3]:px-[calc(var(--accordion-padding)+.5rem)]"
                     >
                        <AccordianTrigger className="[&_button_>_div]:w-full [&_button_>_div]:pr-3">
                           <div className="flex w-full items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                 <TranscriptIcon className="size-5" />
                                 <span>Transcript</span>
                              </div>
                              {doc.youtubeVideo?.transcript?.confidence && (
                                 <TooltipRoot delayDuration={100}>
                                    <TooltipTrigger asChild>
                                       <Badge variant="soft" intent="primary">
                                          <div className="flex items-center gap-2">
                                             <span>
                                                {(
                                                   doc.youtubeVideo?.transcript
                                                      ?.confidence * 100
                                                ).toFixed(2)}
                                                %
                                             </span>
                                          </div>
                                       </Badge>
                                    </TooltipTrigger>
                                    <TooltipPortal>
                                       <TooltipContent className="mr-8">
                                          This transcript has a confidence{" "}
                                          <br /> level of{" "}
                                          {(
                                             doc.youtubeVideo?.transcript
                                                ?.confidence * 100
                                          ).toFixed(2)}
                                          %.
                                       </TooltipContent>
                                    </TooltipPortal>
                                 </TooltipRoot>
                              )}
                           </div>
                        </AccordianTrigger>
                        <AccordianContent className="prose-sm prose-violet overflow-y-auto px-6 dark:prose-invert lg:prose-base xl:max-h-[calc(100dvh-360px)]">
                           <p className="!mt-0 whitespace-pre-wrap">
                              {doc.youtubeVideo?.transcript?.text}
                           </p>
                        </AccordianContent>
                     </AccordianItem>
                  </AccordianRoot>
               </div>
            </div>
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
