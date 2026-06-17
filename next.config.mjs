const normalizeBasePath = (path = "") => path.replace(/\/+$/, "")
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || "")
const assetPrefix = basePath || undefined
const enableServerMode = process.env.ENABLE_VPS_MODE === "1"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  assetPrefix,
  trailingSlash: true,
  ...(enableServerMode ? {} : { output: "export" }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [75, 90],
  },
}

export default nextConfig
