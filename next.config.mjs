/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow remote dish images (e.g. Vercel Blob) and local uploads.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
