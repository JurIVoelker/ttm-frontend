import { Metadata } from "next";
import { Html, Head, Main, NextScript } from "next/document";

export const metadata: Metadata = {
  title: "Tischtennis Manager",
  description:
    "Verwalte deine Tischtennis-Mannschaft und bleibe immer auf dem Laufenden.",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/ttm-sm.png" },
    { rel: "icon", url: "/icons/ttm-sm.png" },
  ],
};

export default function Document() {
  return (
    <Html lang="de">
      <Head>
        {process.env.NEXT_PUBLIC_UMAMI_ENV !== "prod" ? (
          <script
            defer
            src="https://umami.jurivoelker.de/script.js"
            data-website-id="78bb6e61-6577-4d5b-b6cf-6f574c572e96"
          />
        ) : (
          <script
            defer
            src="https://umami.jurivoelker.de/script.js"
            data-website-id="c0f1a013-df2a-4a07-b743-d64117e33f69"
          />
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
