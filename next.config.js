/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    mongodburl:
      "mongodb+srv://admin:admin@cluster0.kg4upzz.mongodb.net/sbu-funds?retryWrites=true&w=majority",
  },
};

module.exports = nextConfig;
