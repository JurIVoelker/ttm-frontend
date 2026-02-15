import { useFetchData } from "./use-fetch";
import { SyncDTO } from "@/types/sync";

export const useFetchSync = () => {
  const result = useFetchData<SyncDTO>({
    method: "GET",
    path: `/api/sync/`,
    queryKey: "sync",
  });

  return result;
};
