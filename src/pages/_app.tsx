import { Toaster } from "@/components/ui/sonner";
import { useHydrateTeams } from "@/hooks/use-hydrate-teams";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration.scope);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);

  useHydrateTeams();

  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );
}
