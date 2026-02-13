import { LeaderDTO } from "@/types/leader";
import { useFetchData } from "./use-fetch";

const useFetchLeaders = () => {
  const data = useFetchData<LeaderDTO[]>({
    method: "GET",
    path: "/api/leaders",
    queryKey: "leaders",
  });

  return data;
};

export default useFetchLeaders;
