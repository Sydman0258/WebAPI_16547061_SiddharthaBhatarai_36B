import type { NextConfig } from "next";

const backendURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const IsDEV = backendURL.startsWith("http://localhost");


const nextConfig: NextConfig = {

  /* config options here */
  images: {
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com" // domain
      },
      // {..}
    ]
  },
  async redirects() {
    return [
      {
        source: '/payment/esewa/customer/orders/esewa-callback',
        destination: '/customer/orders/esewa-callback',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;