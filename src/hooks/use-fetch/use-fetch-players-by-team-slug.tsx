import { PlayerOfTeamDTO } from "@/types/player";
import { useFetchData } from "./use-fetch";
import { mainStore } from "@/store/main-store";

export const useFetchPlayersByTeamSlug = () => {
  const teamSlug = mainStore((state) => state.teamSlug);

  const data = useFetchData<{ players: PlayerOfTeamDTO[] }>({
    method: "GET",
    path: `/api/players/${teamSlug}`,
    ready: Boolean(teamSlug),
    queryKey: "players-" + teamSlug,
  });

  return data;
};
