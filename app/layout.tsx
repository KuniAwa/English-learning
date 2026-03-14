import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { OfflineBanner } from "@/components/OfflineBanner";

export const metadata: Metadata = {
  title: "Talk Abroad - 海外で話せる英語",
  description:
    "海外旅行・初対面・レストランやホテルで困らない、会話中心の英語練習アプリ。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Talk Abroad",
  },
  icons: {
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2c5282",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen safe-area-pb standalone-padding">
        <ServiceWorkerRegister />
        <OfflineBanner />
        <main className="mx-auto max-w-lg min-h-dvh pb-28">
          {children}
        </main>
      </body>
    </html>
  );
}
