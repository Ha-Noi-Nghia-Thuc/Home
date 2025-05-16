import type { Metadata } from "next";
import { EB_Garamond, Merriweather } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const merriweather = Merriweather({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-merriweather",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "Hà Nội Nghĩa Thục",
  description:
    "Nền tảng giáo dục và văn hóa, kế thừa tinh thần Đông Kinh Nghĩa Thục.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${merriweather.variable} ${ebGaramond.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
