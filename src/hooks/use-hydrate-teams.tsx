import { useEffect } from "react";
import useAuthStore from "./use-auth-store";
import { mainStore } from "@/store/main-store";
import { sendRequest } from "@/lib/fetch-utils";
import { useRouter } from "next/router";

export const useHydrateTeams = () => {
  const { authStore, loading } = useAuthStore();
  const { setTeams } = mainStore();
  const { push } = useRouter();

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
          if (
            res.status === 503 &&
            !window.location.pathname.includes("/info/verbindung")
          ) {
            push("/info/verbindung");
            return;
          }
          return;
        }
        const data = await res.json();
        setTeams(data.teams);
      } catch (error) {
        if (error instanceof Error && error.message === "Failed to fetch") {
          push("/info/verbindung");
        }
      }
    })();
  }, [authStore.jwt, loading, setTeams, push]);
};
