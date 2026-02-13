import { useFetchData } from "./use-fetch";
import { TeamPositionsDTO } from "@/types/team";

export const useFetchTeamPositions = () => {
  const result = useFetchData<{
    teams: TeamPositionsDTO[];
  }>({
    method: "GET",
    path: "/api/teams/types/positions",
    queryKey: "team-positions",
  });

  return result;
};
