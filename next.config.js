/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  environment: {
    ALCHEMY_ID: process.env.ALCHEMY_ID,
  },
};

module.exports = nextConfig;
