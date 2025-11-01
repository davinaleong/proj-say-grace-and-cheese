import type { Metadata } from "next";
import { Barriecito, Montserrat } from "next/font/google";
import "./globals.css";
import { MusicProvider } from "./contexts/MusicContext";
import MusicControl from "./components/MusicControl";

const barriecito = Barriecito({
  weight: "400",
  variable: "--font-barriecito",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Say Grace and Cheese",
  description: "Private Photography Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barriecito.variable} ${montserrat.variable} antialiased`}
      >
        <MusicProvider>
          {children}
          <MusicControl />
        </MusicProvider>
      </body>
    </html>
  );
}
