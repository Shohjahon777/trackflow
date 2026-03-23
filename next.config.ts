import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  allowedDevOrigins: ['192.168.30.18']
};

export default nextConfig;
