/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["media.valorant-api.com"],
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
