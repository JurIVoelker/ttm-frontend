import { sendRequest } from "@/lib/fetch-utils";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface FetchDataProps {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  ready?: boolean;
  queryKey: string;
}

export function useFetchData<T>(props: FetchDataProps) {
  const [data, setData] = useState<T | null>(null);

  const { method, path, body, ready = true, queryKey } = props;

  const queryResponse = useQuery({
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

      const data = (await response.json()) as T;
      setData(data);
      return data;
    },
  });

  return {
    ...queryResponse,
    data,
    setData: (data: T) => setData(data),
  };
}
