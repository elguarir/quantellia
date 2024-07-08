import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import ClerkProvider from "@/components/clerk-provider";

export const metadata: Metadata = {
    title: "Echo Mind",
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
                    GeistMono.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                >
                    <ClerkProvider>{children}</ClerkProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
