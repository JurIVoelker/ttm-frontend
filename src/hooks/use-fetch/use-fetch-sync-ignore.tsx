import { useFetchData } from "./use-fetch";
import { TTApiMatch } from "@/types/sync";

export const useFetchSyncIgnore = () => {
  const result = useFetchData<TTApiMatch[]>({
    method: "GET",
    path: `/api/sync/ignore`,
    queryKey: "sync-ignored-matches",
  });

  return result;
};
