import type { Metadata, Viewport } from "next";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { cn } from "~/utils/cn";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://activeaces.com"
      : "http://localhost:3000",
  ),
  title: "Active Aces",
  description: "A fitness and gym tracking platform",
  openGraph: {
    title: "Active Aces",
    description: "A fitness and gym tracking platform",
    url: "https://activeaces.com",
    siteName: "Active Aces",
  },
  twitter: {
    card: "summary_large_image",
    site: "@activeaces",
    creator: "@activeaces",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Button>Hey</Button>
        <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
