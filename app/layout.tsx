import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MorukAI — WhatsApp'taki kişisel yaşam koçun",
  description:
    "MorukAI, WhatsApp üzerinden çalışan kişisel yaşam koçu AI'ın. Her gün motivasyon, disiplin ve küçük adımlarla daha iyi bir hayata.",
  openGraph: {
    title: "MorukAI",
    description: "WhatsApp'taki kişisel yaşam koçun.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
