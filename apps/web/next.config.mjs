/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  env: {
    NEXT_PUBLIC_RT_URL: process.env.NEXT_PUBLIC_RT_URL,
  }
};

export default nextConfig;

