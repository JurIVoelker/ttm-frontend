import { SyncPlayersReturnType } from "@/types/sync";
import { useFetchData } from "./use-fetch";

export const useFetchSyncPlayers = () => {
  return useFetchData<SyncPlayersReturnType>({
    method: "GET",
    path: `/api/sync/players`,
    queryKey: "sync-players",
  });
};
