import type { Metadata } from "next";
import "../styles/global.scss";

export const metadata: Metadata = {
  title: "Geo Portfolio",
  description: "Geo's portfolio, styled like a Discord server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
