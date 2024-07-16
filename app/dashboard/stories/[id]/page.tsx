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
import { AI } from "@/server/actions/AI/ai";

interface DashboardPageProps {}

const DashboardPage = (p: DashboardPageProps) => {
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
                        The Hidden Cost of Digital Convenience 💰
                     </BreadcrumbPage>
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
            <div className="relative h-[calc(100dvh-180px)] w-full py-6">
               <AI>
                  <Chat />
               </AI>
            </div>
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
