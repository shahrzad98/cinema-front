import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "طراحی لباس سینما و تئاتر | طراح لباس صحنه و سینما",
  description:
    "طراحی لباس سینما و تئاتر با رویکرد پژوهش محور، طراحی کانسپت، انتخاب متریال، ساخت و اجرای لباس صحنه برای تئاتر و فیلم.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "طراحی لباس سینما و تئاتر",
    description:
      "نمونه‌کارها، درباره من و فرم تماس برای سفارش طراحی لباس سینما و تئاتر.",
    type: "website",
    url: "/"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
