import type { Metadata } from "next";
import "./globals.css";
import "./project-cases.css";
import "./project-reading.css";
import "./home-composition.css";

export const metadata: Metadata = {
  title: "Luke Shi 史翼洋｜AI 产品经理",
  description: "Luke Shi 史翼洋的 AI 产品主页：AI 应用、模型评测、质量治理与规模化落地，关注 AI Native 产品。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
