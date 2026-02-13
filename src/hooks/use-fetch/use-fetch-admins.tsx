import { useFetchData } from "./use-fetch";
import { Admin } from "@/types/admin";

export const useFetchAdmins = () => {
  const result = useFetchData<Admin[]>({
    method: "GET",
    path: `/api/admins`,
    queryKey: "admins",
  });

  return result;
};
