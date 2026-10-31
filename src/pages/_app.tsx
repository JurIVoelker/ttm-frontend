import { Toaster } from "@/components/ui/sonner";
import { useHydrateTeams } from "@/hooks/use-hydrate-teams";
import { registerServiceWorker } from "@/lib/push-notifications";
import { asyncStoragePersister, queryClient } from "@/lib/query";
import { authStore } from "@/store/auth-store";
import "@/styles/globals.css";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { useEffect, useLayoutEffect } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  // Loads the persisted login from localStorage (synchronously) after hydration. Layout
  // effects run before all passive effects, so no request is sent without the JWT, and
  // the re-render happens before the first paint.
  useLayoutEffect(() => {
    authStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (document.readyState === "complete") {
      registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker);
      return () => window.removeEventListener("load", registerServiceWorker);
    }
  }, []);

  useHydrateTeams();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister, maxAge: 1000 * 60 * 60 * 24 }}
    >
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <div
          className={`${poppins.className} min-h-screen w-full`}
        >
          <Toaster />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
