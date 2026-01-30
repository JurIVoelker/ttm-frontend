import { Toaster } from "@/components/ui/sonner";
import { useHydrateTeams } from "@/hooks/use-hydrate-teams";
import { registerServiceWorker } from "@/lib/push-notifications";
import "@/styles/globals.css";
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
    <>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <div className={`h-screen min-h-screen ${poppins.className}`}>
          <Toaster />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}
