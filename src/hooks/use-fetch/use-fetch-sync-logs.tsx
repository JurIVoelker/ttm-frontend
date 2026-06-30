import { SyncLogDTO } from "@/types/sync";
import { useFetchData } from "./use-fetch";

export const useFetchSyncLogs = () => {
  const result = useFetchData<SyncLogDTO[]>({
    method: "GET",
    path: `/api/sync/logs`,
    queryKey: "sync-logs",
  });

  return result;
};
