/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@metaverse/core',
    '@metaverse/rt',
    '@metaverse/three',
    '@metaverse/ui',
  ],
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

