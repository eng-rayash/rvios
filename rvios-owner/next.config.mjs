/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rvios/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.rvios.com' },
    ],
  },
};
export default nextConfig;
