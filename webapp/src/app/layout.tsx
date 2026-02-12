import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import Script from "next/script";
import { SegmentPageTracker } from "./components/segment/segment-page-tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConversationRelay Translator",
  description: "Manage translation profiles and settings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Script
          id="segment-snippet"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY}";;analytics.SNIPPET_VERSION="5.2.1";
              analytics.load("${process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY}");
              analytics.page();
              }}();
            `,
          }}
        />
        <Providers>
          <SegmentPageTracker />
          <Navigation />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
