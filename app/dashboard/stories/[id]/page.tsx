import PageWrapper from "@/components/page-wrapper";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Chat from "./_components/chat";
import { AI, UIState } from "@/server/actions/AI/ai";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Badge from "@/components/tailus-ui/badge";

interface StoryDetailsPageProps {
   params: {
      id: string;
   };
}

const StoryDetailsPage = async (p: StoryDetailsPageProps) => {
   const { userId } = auth();
   if (!userId)
      return auth().redirectToSignIn({ returnBackUrl: "/dashboard/stories" });

   const story = await db.story.findUnique({
      where: {
         id: p.params.id,
         userId,
      },
   });

   if (!story) return notFound();
   return (
      <PageWrapper
         title={
            <Breadcrumb>
               <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link href={"/dashboard"}>Dashboard</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link href={"/dashboard/stories"}>Stories</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage className="line-clamp-1">
                        {story.title}
                     </BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="h-full min-h-[calc(100dvh-80px)] divide-y p-6">
            <div className="flex items-center justify-between pb-6">
               <h1 className="text-2xl font-semibold">Story</h1>
            </div>
            <div className="relative h-[calc(100dvh-180px)] w-full py-6">
               <AI initialUIState={[{

               }] as UIState}>
                  <Chat />
               </AI>
            </div>
         </div>
      </PageWrapper>
   );
};

export default StoryDetailsPage;
