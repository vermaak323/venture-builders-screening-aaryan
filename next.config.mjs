/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://dummyjson.com/:path*',
      },
    ];
  },
};

export default nextConfig;
