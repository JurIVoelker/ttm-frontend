import { sendRequest } from "@/lib/fetch-utils";
import { useCallback, useEffect, useState } from "react";

interface FetchDataProps {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  ready?: boolean;
}

export function useFetchData<T>(props: FetchDataProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { method, path, body, ready = true } = props;

  const fetchData = useCallback(async () => {
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
  }, [path, method, body]);

  useEffect(() => {
    setLoading(true);
    if (!ready) return;
    fetchData()
      .finally(() => setLoading(false))
      .catch((err) => {
        if (err instanceof Error) {
          setError(err);
        }
      });
  }, [ready, path, method, body, fetchData]);

  return { data, loading, error, setData: (data: T) => setData(data) };
}
