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
import { Types } from "@/lib/constants";
import { parseAsArrayOf, parseAsStringEnum } from "nuqs";
import StoriesIllustration from "@/components/illustration/stories-illustration";
import { Caption, Kbd, Text, Title } from "@/components/tailus-ui/typography";
import Card from "@/components/tailus-ui/card";
import EmptyStories from "./_components/empty";
import Link from "next/link";

interface DashboardPageProps {
   searchParams: {
      search?: string;
      filter?: string;
   };
}

const DashboardPage = (p: DashboardPageProps) => {
   //    const { userId } = auth();
   //    if (!userId) return auth().redirectToSignIn({ returnBackUrl: "/dashboard" });
   //    const docs = await db.document.findMany({
   //       where: {
   //          userId,
   //       },
   //       include: { file: true, youtubeVideo: true, webPage: true },
   //       orderBy: {
   //          xata_createdat: "desc",
   //       },
   //    });

   //    const filterValue =
   //       parseAsArrayOf(parseAsStringEnum<Types>(Object.values(Types)), ",")
   //          .withOptions({
   //             clearOnDefault: true,
   //          })
   //          .withDefault([])
   //          .parse(p.searchParams.filter ?? "") ?? [];

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
               <div>{/* <AddDocumentSheet /> */}</div>
            </div>
            <div className="flex h-full w-full flex-1 flex-col space-y-6 py-6">
               <EmptyStories />
            </div>
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
