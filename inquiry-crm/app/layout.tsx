import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "询盘跟进 CRM",
  description: "业务员询盘跟进 CRM 后台"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
