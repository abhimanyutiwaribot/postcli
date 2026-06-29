import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rqscli.vercel.app"),
  title: "RQS — Interactive Developer HTTP Client",
  description: "An interactive, terminal-based HTTP client built for developers, featuring automated parameter tokenization and responsive ASCII mascot companions.",
  openGraph: {
    title: "RQS — Interactive Developer HTTP Client",
    description: "An interactive, terminal-based HTTP client built for developers, featuring automated parameter tokenization and responsive ASCII mascot companions.",
    url: "https://rqscli.vercel.app",
    siteName: "RQS",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RQS — Interactive Developer HTTP Client",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RQS — Interactive Developer HTTP Client",
    description: "An interactive, terminal-based HTTP client built for developers, featuring automated parameter tokenization and responsive ASCII mascot companions.",
    images: ["/opengraph-image.png"],
    creator: "@abhimanyutwts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-mono bg-[#d6d6d6] text-black dark:bg-black dark:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
          <div className="w-full max-w-6xl mx-auto px-4 pt-6 md:px-8 md:pt-12 animate-fade-in">
            <Header />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
