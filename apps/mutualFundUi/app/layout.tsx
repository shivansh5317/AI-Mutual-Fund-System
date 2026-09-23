import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./styles/index.css";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { WealthLoader } from "./components/WealthLoader";
import { QueryProvider } from "./providers/QueryProvider";
import AuthSessionProvider from "./providers/SessionProvider";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "WealthAI - AI-Powered Wealth Building",
  description: "AI-powered mutual fund recommendations and portfolio management",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F1419] text-white overflow-x-hidden`}>
        <AuthSessionProvider>
          <QueryProvider>
            <Navigation />
            <div className="flex">
              <div className="w-64 flex-shrink-0"></div>
              <main className="flex-1 min-h-screen flex flex-col">
                <div className="flex-1 p-6">
                  <Suspense fallback={<WealthLoader />}>
                    {children}
                  </Suspense>
                </div>
                <Footer />
              </main>
            </div>
            <Toaster 
              theme="dark" 
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1A2332',
                  border: '1px solid #374151',
                  color: '#fff',
                },
              }}
            />
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
