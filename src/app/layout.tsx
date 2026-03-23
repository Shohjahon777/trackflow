import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "TrackFlow — One dashboard for everything you ship",
    template: "%s — TrackFlow",
  },
  description:
    "The multi-project command center and developer identity platform for solo builders. Manage projects, share progress with clients, and showcase your work with a public profile.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://trackflow.dev"
  ),
  keywords: [
    "project management",
    "developer portfolio",
    "solo builder",
    "freelancer tools",
    "project dashboard",
    "client share links",
    "developer profile",
    "shipping tracker",
  ],
  authors: [{ name: "TrackFlow" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TrackFlow",
    title: "TrackFlow — One dashboard for everything you ship",
    description:
      "Manage projects, share progress with clients, and showcase your work with a public profile.",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackFlow — One dashboard for everything you ship",
    description:
      "The multi-project command center for solo builders.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text-body font-sans">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
