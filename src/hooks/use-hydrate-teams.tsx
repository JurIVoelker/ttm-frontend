import { useEffect } from "react";
import useAuthStore from "./use-auth-store";
import { mainStore } from "@/store/main-store";
import { sendRequest } from "@/lib/fetch-utils";
import Router, { useRouter } from "next/router";

const CONNECTION_INFO_PATH = "/info/verbindung";

const showConnectionInfo = () => {
  if (window.location.pathname.includes(CONNECTION_INFO_PATH)) return;
  Router.push(CONNECTION_INFO_PATH);
};

export const useHydrateTeams = () => {
  const { authStore, loading } = useAuthStore();
  const { setTeams } = mainStore();
  // Reload teams on every page change (e.g. "Erneut versuchen" on the connection page)
  const { asPath } = useRouter();

  useEffect(() => {
    if (loading || !authStore.jwt) return;
    (async () => {
      try {
        const res = await sendRequest({
          method: "GET",
          path: "/api/teams",
        });
        if (!res.ok) {
          if (res.status === 429) return;
          if (res.status === 503) showConnectionInfo();
          return;
        }
        const data = await res.json();
        setTeams(data.teams);
      } catch (error) {
        // fetch rejects with a TypeError on network errors; the message differs
        // per browser ("Failed to fetch", "Load failed", "NetworkError …")
        if (error instanceof TypeError) showConnectionInfo();
      }
    })();
    // Router.push (singleton) instead of useRouter().push: the hook's methods change
    // on every navigation, including pushes to the current page, which looped.
  }, [authStore.jwt, loading, setTeams, asPath]);
};
