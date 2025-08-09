import type { NextConfig } from "next"
import { env } from "~/env"
import { withPostHogConfig } from "@posthog/nextjs-config"

const nextConfig: NextConfig = {
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/flags",
        destination: "https://us.i.posthog.com/flags",
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

export default withPostHogConfig(nextConfig, {
  personalApiKey: env.POSTHOG_PERSONAL_API_KEY!, // Personal API Key
  envId: env.POSTHOG_ENV_ID, // Environment ID
  host: env.NEXT_PUBLIC_POSTHOG_HOST, // (optional), defaults to https://us.posthog.com
  sourcemaps: {
    enabled: true,
    project: "Active Aces",
    deleteAfterUpload: true,
  },
})
