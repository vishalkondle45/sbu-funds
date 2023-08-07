/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    mongodburl: "mongodb+srv://sbu:sbu@sbu.mldiktr.mongodb.net/",
  },
};

module.exports = nextConfig;
