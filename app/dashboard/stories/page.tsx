import PageWrapper from "@/components/page-wrapper";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import EmptyStories from "./_components/empty";
import Link from "next/link";
import AddStorySheet from "./_components/add-story-sheet";
import Card from "@/components/tailus-ui/card";
import { Caption, Title } from "@/components/tailus-ui/typography";
import SeparatorRoot from "@/components/tailus-ui/separator";
import Badge from "@/components/tailus-ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/tailus-ui/button";
import { Eye } from "lucide-react";

interface DashboardPageProps {
   searchParams: {
      search?: string;
      filter?: string;
   };
}

const DashboardPage = async (p: DashboardPageProps) => {
   const { userId } = auth();
   if (!userId) return auth().redirectToSignIn({ returnBackUrl: "/dashboard" });
   const stories = await db.story.findMany({
      where: {
         userId,
      },
      orderBy: {
         xata_createdat: "desc",
      },
   });

   return (
      <PageWrapper
         title={
            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link href={"/dashboard"}>Dashboard</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage>Stories</BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="h-full min-h-[calc(100dvh-80px)] divide-y p-6">
            <div className="flex items-center justify-between pb-6">
               <h1 className="text-2xl font-semibold">Stories</h1>
               <div>
                  <AddStorySheet />
               </div>
            </div>
            <div className="flex h-full w-full flex-1 flex-col space-y-6 py-6">
               {stories.length > 0 ? (
                  <div className="grid w-full grid-cols-1 flex-col gap-3 md:grid-cols-2 lg:grid-cols-3">
                     {stories.map((story) => (
                        <Card className="flex flex-col">
                           <div className="flex items-center pb-8">
                              <div className="space-y-1">
                                 <Title className="leading-7">
                                    {story.title}
                                 </Title>
                                 <Caption size={"sm"}>
                                    {story.description ?? "No description"}
                                 </Caption>
                              </div>
                           </div>
                           <SeparatorRoot />
                           <div className="flex w-full items-center justify-between gap-2 pt-3">
                              <Badge
                                 variant="soft"
                                 intent={
                                    story.readyToStart ? "success" : "warning"
                                 }
                              >
                                 {story.readyToStart
                                    ? "Ready to start"
                                    : "Not ready yet."}
                              </Badge>
                              <div className="flex items-center gap-2">
                                 <Caption size={"sm"}>
                                    {format(
                                       story.xata_createdat,
                                       "MMM dd, yyyy hh:mm a",
                                    )}
                                 </Caption>
                                 <Button.Root
                                    variant="outlined"
                                    intent="gray"
                                    asChild
                                    className="p-2"
                                    disabled={!story.readyToStart}
                                 >
                                    <Link
                                       href={`/dashboard/stories/${story.id}`}
                                    >
                                       <Button.Icon type="only" className="w-5">
                                          <Eye className="w-4" />
                                       </Button.Icon>
                                    </Link>
                                 </Button.Root>
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
               ) : (
                  <EmptyStories />
               )}
            </div>
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
