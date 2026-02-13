import { Toaster } from "@/components/ui/sonner";
import { useHydrateTeams } from "@/hooks/use-hydrate-teams";
import { registerServiceWorker } from "@/lib/push-notifications";
import { asyncStoragePersister, queryClient } from "@/lib/query";
import "@/styles/globals.css";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { useEffect } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log("Registering SW...");
      window.addEventListener("load", registerServiceWorker);
    } else {
      console.log("Service workers are not supported.");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigator.serviceWorker]);

  useHydrateTeams();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <div className={`${poppins.className} min-h-screen w-full`}>
          <Toaster />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
