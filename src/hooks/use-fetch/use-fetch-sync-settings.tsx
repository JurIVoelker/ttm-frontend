import { Settings } from "@/types/sync";
import { useFetchData } from "./use-fetch";

export const useFetchSyncSettings = () => {
  const result = useFetchData<Settings>({
    method: "GET",
    path: `/api/sync/settings`,
    queryKey: "sync-settings",
  });

  return result;
};
