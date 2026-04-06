import { authStore } from "@/store/auth-store";
import { useShallow } from "zustand/react/shallow";

const useAuthStore = () => {
  const store = authStore(useShallow((state) => state));

  return { authStore: store, loading: !store.isHydrated };
};

export default useAuthStore;
