import "./globals.css";

import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vquiz - AI-Powered Quiz & Chat",
  description:
    "Turn any topic into interactive AI quizzes instantly with Vquiz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <Header />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
