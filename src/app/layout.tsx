import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/Providers";
import { CustomCursor } from "@/components/ui/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Mentoria Hub MVP",
  description: "Educational opportunities and courses for students",
};

// Inline script: read theme from localStorage before paint to avoid FOUC
const themeInit = `try{var t=localStorage.getItem("theme")||"dark";document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      translate="no"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Prevent Google Translate and other auto-translators from garbling animated text */}
        <meta name="google" content="notranslate" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <I18nProvider>
            <AppProvider>
              <CustomCursor />
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
            </AppProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
