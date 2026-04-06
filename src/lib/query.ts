import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // always stale → refetch in background, but serve cache immediately
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof Error) {
          const msg = error.message;
          if (msg.includes('"status":401') || msg.includes('"status":403')) return false;
        }
        return failureCount < 2;
      },
    },
  },
})

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
})
