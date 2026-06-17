import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/Providers";

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

// Inline script: set dark class before paint to avoid flash
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||(t===null&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <Providers>
          <I18nProvider>
            <AppProvider>
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              
              {/* Google Translate Hidden Widget */}
              <div id="google_translate_element" style={{ display: "none" }}></div>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    function googleTranslateElementInit() {
                      new google.translate.TranslateElement({
                        pageLanguage: 'ru',
                        includedLanguages: 'ru,en,kk',
                        autoDisplay: false
                      }, 'google_translate_element');
                    }
                  `,
                }}
              />
              <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async defer></script>
            </AppProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
