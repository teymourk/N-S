import type { Metadata, Viewport } from "next";
import { GuestProvider } from "@/lib/guest-context";
import { Background } from "@/components/background";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nima & Saba — The Game",
  description: "Play, compete, and celebrate at Nima & Saba's wedding. 7 rounds. 1 leaderboard. Infinite fun.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased min-h-screen"
        style={{ backgroundColor: "#0a0a1a", color: "#f0e6d3" }}
      >
        <Background />
        <GuestProvider>{children}</GuestProvider>
      </body>
    </html>
  );
}
