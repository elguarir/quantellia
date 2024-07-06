import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
    title: "Fluent Script",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={cn(GeistSans.variable, GeistMono.variable)}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
