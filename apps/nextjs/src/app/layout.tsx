import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { ThemeProvider } from "~/components/theme";
import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { cn } from "~/lib/cn";

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
    images: ["/og-image.png"],
    siteName: "Active Aces",
  },
  twitter: {
    card: "summary_large_image",
    site: "@activeaces",
    creator: "@activeaces",
  },
  appleWebApp: {
    title: "Active Aces",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ height: "100svh" }}
        className={cn(
          "flex flex-col bg-background font-sans text-foreground antialiased",
          inter.className,
        )}
      >
        <ClerkProvider
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#22c55e",
              colorTextOnPrimaryBackground: "#054016",
            },
          }}
          publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TRPCReactProvider>
              {/* <NavBar /> */}
              {props.children}
            </TRPCReactProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
