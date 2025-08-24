import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "FinFix - Financial Management Platform",
  description:
    "Track your monthly finances, debts, and get insights into your spending patterns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="theme-purple" suppressHydrationWarning lang="en">
      <body className={"bg-background text-foreground"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
