"use client";
import { PropsWithChildren, useState } from "react";
import {
   QueryClient,
   QueryClientProvider as ReactQueryClientProvider,
   useQuery,
} from "@tanstack/react-query";
const QueryClientProvider = (p: PropsWithChildren) => {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <ReactQueryClientProvider client={queryClient}>
         {p.children}
      </ReactQueryClientProvider>
   );
};

export default QueryClientProvider;
