/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Harry_PersonalWebsite",
  assetPrefix: "/Harry_PersonalWebsite/",
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
