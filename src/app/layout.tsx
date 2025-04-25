import type { Metadata, Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Inter } from "next/font/google"
import "./globals.css"
import { env } from "~/env"
import { headers } from "next/headers"
import { cn } from "~/lib/utils"
import { TRPCProvider } from "~/lib/trpc/client"

export async function generateViewport(): Promise<Viewport> {
  const userAgent = (await headers()).get("user-agent")
  const isiPhone = /iphone/i.test(userAgent ?? "")
  return isiPhone
    ? {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1, // disables auto-zoom on ios safari
      }
    : {}
}

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production" ? "https://activeaces.com" : "http://localhost:3000",
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
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{ height: "100svh" }}
        className={cn(
          "bg-background text-foreground flex flex-col font-sans antialiased",
          inter.variable,
        )}
        data-new-gr-c-s-check-loaded="14.1232.0"
        data-gr-ext-installed=""
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#22c55e",
              colorTextOnPrimaryBackground: "#054016",
            },
          }}
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <TRPCProvider>{children}</TRPCProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
