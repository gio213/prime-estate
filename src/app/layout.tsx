import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer";
import FadeContent from "@/components/FadeContent";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CanListProvider } from "@/context/CanListProvider";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const inter = Inter({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prime Estate",
  description: "Your premier real estate destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <CanListProvider>
        <html lang="en" suppressHydrationWarning>
          <meta
            property="og:image"
            content="https://prime-estate-ruddy.vercel.app/assets/hero-social.png"
          />

          <body
            className={`${geistSans.variable} ${geistMono.variable} ${inter.style} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <FadeContent
                blur={true}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
              >
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow p-10 ">{children}</main>
                  <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    visibleToasts={100}
                  />
                  <Footer />
                </div>
              </FadeContent>
            </ThemeProvider>
          </body>
        </html>
      </CanListProvider>
    </AuthProvider>
  );
}
