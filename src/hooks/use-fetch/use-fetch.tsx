import { sendRequest } from "@/lib/fetch-utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface FetchDataProps {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  ready?: boolean;
  queryKey: string;
}

export function useFetchData<T>(props: FetchDataProps) {
  const { method, path, body, ready = true, queryKey } = props;

  return useQuery<T>({
    queryKey: [queryKey],
    placeholderData: keepPreviousData,
    retryDelay: 1000,
    enabled: ready,
    queryFn: async () => {
      const response = await sendRequest({
        path,
        method,
        body,
      });

      if (!response.ok) {
        throw new Error(
          JSON.stringify({
            message: "Request failed",
            status: response.status,
            statusText: response.statusText,
          }),
        );
      }

      return response.json() as Promise<T>;
    },
  });
}
