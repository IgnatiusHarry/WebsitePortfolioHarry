const normalizeBasePath = (path = "") => path.replace(/\/+$/, "")
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || "")
const assetPrefix = basePath || undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [75, 90],
  },
}

export default nextConfig
