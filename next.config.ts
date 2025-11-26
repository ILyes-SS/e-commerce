import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**", // This allows any path on that hostname
      },
      {
        protocol: "https",
        hostname: "eduindex.org",
        port: "",
        pathname: "/**", // This allows any path on that hostname
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // This allows any path on that hostname
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**", // This allows any path on that hostname
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**", // This allows any path on that hostname
      },
      // You can add other domains here as needed
    ],
  },
};

export default nextConfig;
