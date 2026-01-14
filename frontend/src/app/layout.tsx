import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers"; // Import Providers

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeCast - Nền tảng Booking KOL số 1",
  description: "Kết nối Brand và KOL chuyên nghiệp, nhanh chóng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}