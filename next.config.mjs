/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      new URL("https://cdn.discordapp.com/**"),
      new URL("https://archive.org/**"),
      new URL("https://cdn.cleoai.cloud/**"),
    ],
  },
};

export default nextConfig;
