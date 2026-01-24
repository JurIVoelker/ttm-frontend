import { Toaster } from "@/components/ui/sonner";
import { useHydrateTeams } from "@/hooks/use-hydrate-teams";
import { registerServiceWorker } from "@/lib/push-notifications";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log("Registering SW...");
      window.addEventListener("load", registerServiceWorker);
    } else {
      console.log("Service workers are not supported.");
    }
  }, []);

  useHydrateTeams();

  return (
    <>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <div className="h-screen min-h-screen">
          <Toaster />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}
