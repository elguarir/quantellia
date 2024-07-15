import NotFoundIllustration from "@/components/illustration/404-illustration";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/tailus-ui/button";
import { Caption } from "@/components/tailus-ui/typography";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFound = () => {
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
                     <BreadcrumbLink href="/documents" asChild>
                        <Link href={"/dashboard/documents"}>Documents</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage className="line-clamp-1">
                        Not found
                     </BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         }
      >
         <div className="flex h-[calc(100dvh-80px)] w-full items-center justify-center p-6">
            <div className="flex flex-col items-center space-y-3">
               <NotFoundIllustration className="w-full" />
               <p className="text-lg font-semibold">Document not found</p>
               <Button.Root asChild variant="outlined" intent="gray">
                  <Link href={"/dashboard/documents"}>
                     <Button.Icon type="leading">
                        <ArrowLeftIcon />
                     </Button.Icon>
                     <Button.Label>Go back</Button.Label>
                  </Link>
               </Button.Root>
            </div>
         </div>
      </PageWrapper>
   );
};

export default NotFound;
