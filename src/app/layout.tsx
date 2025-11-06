import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Provider";
import { MUIThemeProvider } from "@/components/theme/MUIThemeProvider";
import { NextThemeProvider } from "@/components/theme/NextThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dynamic Data Table Manager",
  description: "A modern data table manager with CRUD operations, sorting, filtering, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MUIThemeProvider>
            <Providers>
              {children}
            </Providers>
          </MUIThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}