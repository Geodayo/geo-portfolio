import type { Metadata } from "next";
import Script from "next/script";
import "../styles/global.scss";

// GA4 measurement ID — public by nature (it ships in the HTML of every
// page), so no need to hide it behind an env var.
const GA_ID = "G-VPXRSE4M1Z";

export const metadata: Metadata = {
  title: "Geo Portfolio",
  description: "Jorge's portfolio, styled like a Discord server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Production-only so dev sessions don't show up as traffic. GA4's
            enhanced measurement tracks client-side route changes (history
            events) on its own, so this one config call covers the whole
            SPA. */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
