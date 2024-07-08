import { StackedCards } from "./_components/overview";
import PageWrapper from "./_components/page-wrapper";

const DashboardPage = () => {
   return (
      <PageWrapper title="Dashboard">
         <div className="space-y-6 p-6">
            <StackedCards />
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
