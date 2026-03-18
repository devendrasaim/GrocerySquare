/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/GrocerySquare',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
