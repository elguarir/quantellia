import { StackedCards } from "./_components/overview";
import PageWrapper from "@/components/page-wrapper";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
} from "@/components/ui/breadcrumb";

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
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="space-y-6 p-6">
            <StackedCards />
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
