import { MatchesDTO } from "@/types/match";
import { useFetchData } from "./use-fetch";
import { mainStore } from "@/store/main-store";

const useFetchMatchesByTeamSlug = () => {
  const teamSlug = mainStore((state) => state.teamSlug);

  const data = useFetchData<MatchesDTO>({
    method: "GET",
    path: `/api/matches/${teamSlug}`,
    ready: Boolean(teamSlug),
    queryKey: "fetch-matches-" + teamSlug,
  });

  return data;
};

export default useFetchMatchesByTeamSlug;
