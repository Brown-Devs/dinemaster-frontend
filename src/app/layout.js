// app/layout.jsx  
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/shared/ThemeProvider";
import CallNotifProvider from "@/components/shared/CallNotifProvider";
// import Script from "next/script";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Dine Master by Brown Devs",
  description: "Restaurant management platform by Brown Devs...",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#ffffff"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={inter.className}>
        <ThemeProvider>
          <CallNotifProvider>
            {children}
          </CallNotifProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
