import { PlayerDTO } from "@/types/player";
import { useFetchData } from "./use-fetch";

export const useFetchPlayers = () => {
  const data = useFetchData<{ players: PlayerDTO[] }>({
    method: "GET",
    path: `/api/players`,
    queryKey: "players",
  });

  return data;
};
