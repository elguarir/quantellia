"use client"
import PageWrapper from "@/components/page-wrapper";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddDocumentSheet from "./_components/add-document-sheet";
import useKeypress from "@/hooks/use-key-press";

const DashboardPage = () => {
    
   return (
      <PageWrapper
         title={
            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <BreadcrumbLink href="/dashboard">
                        Dashboard
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage>Documents</BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
               <h1 className="text-2xl font-semibold">Documents</h1>

               <div>
                  <AddDocumentSheet />
               </div>
            </div>
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
