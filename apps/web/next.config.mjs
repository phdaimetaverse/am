/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@metaverse/core',
    '@metaverse/rt',
    '@metaverse/three',
    '@metaverse/ui',
  ],
  async rewrites() {
    return [
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:4001/socket.io/:path*',
      },
    ];
  },
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

