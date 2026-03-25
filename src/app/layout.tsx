import type { Metadata, Viewport } from "next";
import { GuestProvider } from "@/lib/guest-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nima & Saba — The Game",
  description: "Play, compete, and celebrate at Nima & Saba's wedding!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#b76e79",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen gradient-bg">
        <GuestProvider>{children}</GuestProvider>
      </body>
    </html>
  );
}
