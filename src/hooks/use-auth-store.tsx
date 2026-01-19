import { authStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

const useAuthStore = () => {
  const [loading, setLoading] = useState(true);
  const store = authStore((state) => state);

  useEffect(() => {
    if (loading && store.isHydrated) {
      setLoading(false);
    }
  }, [store, loading]);

  return { authStore: store, loading };
};

export default useAuthStore;
