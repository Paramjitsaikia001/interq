import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TestStateSelector } from "@/components/ui/test-state-selector";
import { AuthProvider } from "@/components/auth-provider";
import { SocketProvider } from "@/components/socket-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://interq.dev"),
  title: {
    default: "interQ - Interview Questions Platform",
    template: "%s | interQ",
  },
  description: "Real-world interview questions shared and validated by the developer community. Boost your technical interview prep.",
  keywords: ["interview questions", "technical interview", "coding interview", "software engineer interview", "system design", "developer community"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "interQ - Interview Questions Platform",
    description: "Real-world interview questions shared and validated by the developer community.",
    url: "https://interq.dev",
    siteName: "interQ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "interQ - Interview Questions Platform",
    description: "Real-world interview questions shared and validated by the developer community.",
    creator: "@interq",
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
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-150">
        <AuthProvider>
          <SocketProvider>
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
              {children}
            </main>
            <Footer />
            <TestStateSelector />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

