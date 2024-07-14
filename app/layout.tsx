import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ClerkProvider from "@/components/providers/clerk-provider";
import QueryClientProvider from "@/components/providers/query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/tailus-ui/tooltip";
import ProgressBarProvider from "@/components/providers/progress-bar-provider";
export const metadata: Metadata = {
   title: "Quantellia",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="en"
         data-rounded="large"
         data-shade="900"
         suppressHydrationWarning
      >
         <body
            className={cn(
               GeistSans.className,
               GeistSans.variable,
               GeistMono.variable,
            )}
         >
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
               <ClerkProvider>
                  <QueryClientProvider>
                     <ProgressBarProvider>
                        <TooltipProvider>{children}</TooltipProvider>
                     </ProgressBarProvider>
                     <Toaster closeButton duration={1750} />
                  </QueryClientProvider>
               </ClerkProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
