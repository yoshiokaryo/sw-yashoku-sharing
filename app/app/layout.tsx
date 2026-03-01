import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-rounded",
});

const maru = Zen_Maru_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-maru",
});

export const metadata: Metadata = {
  title: "レス飯 — レスに、レスキュー!!",
  description: "食品ロスを減らし、お得に届ける",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${rounded.variable} ${maru.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
