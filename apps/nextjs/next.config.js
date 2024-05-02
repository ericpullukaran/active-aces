import { fileURLToPath } from "url";
import rehypePrism from "@mapbox/rehype-prism";
import createMDX from "@next/mdx";
import nextMDX from "@next/mdx";
import _jiti from "jiti";
import remarkGfm from "remark-gfm";

const jiti = _jiti(fileURLToPath(import.meta.url));

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
jiti("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/api", "@acme/db", "@acme/validators"],

  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  headers: async () => {
    return [
      {
        source: "/sounds/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
});

export default withMDX(config);
