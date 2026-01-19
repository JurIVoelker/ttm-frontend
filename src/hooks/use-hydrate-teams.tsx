import { useEffect } from "react";
import useAuthStore from "./use-auth-store";
import { mainStore } from "@/store/main-store";
import { sendRequest } from "@/lib/fetch-utils";

export const useHydrateTeams = () => {
  const { authStore, loading } = useAuthStore();
  const { setTeams } = mainStore();

  useEffect(() => {
    if (loading || !authStore.jwt) return;
    (async () => {
      const res = await sendRequest({
        method: "GET",
        path: "/api/teams",
      });
      if (!res.ok) {
        console.error("Failed to fetch teams");
        return;
      }

      const data = await res.json();
      setTeams(data.teams);
    })();
  }, [authStore.jwt, loading, setTeams]);
};
