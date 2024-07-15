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
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import FilterMenu from "./_components/filter-menu";
import SearchBar from "./_components/search-bar";
import { Types } from "@/lib/constants";
import { parseAsArrayOf, parseAsStringEnum } from "nuqs";
import DocumentsGrid from "./_components/documents-grid";
import EmptyDocuments from "./_components/empty";
import Link from "next/link";
import {
   AccordianContent,
   AccordianItem,
   AccordianRoot,
   AccordianTrigger,
} from "@/components/tailus-ui/accordian";
import { ArchiveIcon } from "@radix-ui/react-icons";
import Badge from "@/components/tailus-ui/badge";
import { Caption } from "@/components/tailus-ui/typography";

interface DashboardPageProps {
   searchParams: {
      search?: string;
      filter?: string;
   };
}

const DashboardPage = async (p: DashboardPageProps) => {
   const { userId } = auth();
   if (!userId) return auth().redirectToSignIn({ returnBackUrl: "/dashboard" });
   const docs = await db.document.findMany({
      where: {
         userId,
      },
      include: { file: true, youtubeVideo: true, webPage: true },
      orderBy: {
         xata_createdat: "desc",
      },
   });

   const filterValue =
      parseAsArrayOf(parseAsStringEnum<Types>(Object.values(Types)), ",")
         .withOptions({
            clearOnDefault: true,
         })
         .withDefault([])
         .parse(p.searchParams.filter ?? "") ?? [];
   const getArchivedDocs = (archived: boolean) =>
      docs.filter((doc) => Boolean(doc.archivedAt) === archived);
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
                     <BreadcrumbPage>Documents</BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="divide-y p-6">
            <div className="flex items-center justify-between pb-6">
               <h1 className="text-2xl font-semibold">Documents</h1>
               <div>
                  <AddDocumentSheet />
               </div>
            </div>
            <div className="flex w-full flex-col space-y-6 py-6">
               <div className="flex w-full items-center justify-between gap-2">
                  <SearchBar initialValue={p.searchParams.search} />

                  <div>
                     <FilterMenu defaultFilter={filterValue ?? []} />
                  </div>
               </div>
               {docs.length === 0 ? (
                  <EmptyDocuments />
               ) : (
                  <div className="flex flex-col">
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <DocumentsGrid
                           initialDocs={getArchivedDocs(false)}
                           filterValue={filterValue}
                        />
                     </div>
                     <AccordianRoot
                        type="single"
                        collapsible
                        variant="outlined"
                        defaultValue="archived"
                        className="w-full py-8"
                     >
                        <AccordianItem
                           className="px-0 data-[state=open]:z-0 [&>_h3]:px-[calc(var(--accordion-padding)+.5rem)]"
                           value={"summary"}
                           key={"summary"}
                        >
                           <AccordianTrigger>
                              <div className="flex items-center gap-2">
                                 <ArchiveIcon className="size-5" />
                                 <span>Archived</span>
                              </div>
                              <Badge
                                 size="sm"
                                 variant="soft"
                                 intent="primary"
                                 className="rounded-full"
                              >
                                 {getArchivedDocs(true).length}
                              </Badge>
                           </AccordianTrigger>
                           <AccordianContent className="w-full p-4">
                              {getArchivedDocs(true).length === 0 ? (
                                 <div className="px-5">
                                    <Caption>No archived documents</Caption>
                                 </div>
                              ) : (
                                 <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <DocumentsGrid
                                       initialDocs={getArchivedDocs(true)}
                                       filterValue={filterValue}
                                    />
                                 </div>
                              )}
                           </AccordianContent>
                        </AccordianItem>
                     </AccordianRoot>
                  </div>
               )}
            </div>
         </div>
      </PageWrapper>
   );
};

export default DashboardPage;
