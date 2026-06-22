import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cercle AI - AI-Powered Math & Science Tutor",
  description:
    "Master Mathematics and Science with AI-powered tutoring, step-by-step problem solving, interactive quizzes, and personalized learning paths.",
  keywords: [
    "Cercle AI",
    "AI tutor",
    "math tutor",
    "science tutor",
    "online learning",
    "EdTech",
    "AI education",
    "step-by-step math",
  ],
  authors: [{ name: "Cercle AI" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Cercle AI - AI-Powered Math & Science Tutor",
    description:
      "Master Mathematics and Science with AI-powered tutoring, step-by-step problem solving, and personalized learning.",
    type: "website",
    siteName: "Cercle AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cercle AI - AI-Powered Math & Science Tutor",
    description:
      "Master Mathematics and Science with AI-powered tutoring.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
