import { SingleMatchDTO } from "@/types/match";
import { useFetchData } from "./use-fetch";
import { mainStore } from "@/store/main-store";

const useFetchMatchById = ({ matchId }: { matchId: string }) => {
  const teamSlug = mainStore((state) => state.teamSlug);

  const data = useFetchData<SingleMatchDTO>({
    method: "GET",
    path: `/api/matches/${teamSlug}/${matchId}`,
    ready: Boolean(teamSlug && matchId),
    queryKey: `match-${teamSlug}-${matchId}`,
  });

  return data;
};

export default useFetchMatchById;
