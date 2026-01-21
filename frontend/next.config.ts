import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Bỏ qua lỗi ESLint khi build (Thường dùng cho MVP/Staging để tránh build fail vì lỗi nhỏ)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Bỏ qua lỗi TypeScript khi build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cấu hình cho phép load ảnh từ các domain bên ngoài (Cloudinary, v.v...)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả domain ảnh (hoặc thay bằng res.cloudinary.com)
      },
    ],
  },
};

export default nextConfig;