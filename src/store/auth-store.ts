import { jwtPayload } from "@/types/auth";
import { decode } from "jsonwebtoken";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Store = {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
  jwtDecoded: jwtPayload | null;

  isHydrated: boolean;
  setIsHydrated: (hydrated: boolean) => void;

  inviteToken: string | null;
  setInviteToken: (token: string | null) => void;

  reset: () => void;
};

export const authStore = create<Store>()(
  persist(
    (set) => ({
      jwt: null,
      jwtDecoded: null,
      setJwt: (jwt: string | null) => {
        set({ jwt, jwtDecoded: jwt ? (decode(jwt) as jwtPayload) : null });
      },

      isHydrated: false,
      setIsHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      inviteToken: null,
      setInviteToken: (token: string | null) => set({ inviteToken: token }),

      reset: () =>
        set({
          jwt: null,
          jwtDecoded: null,
          inviteToken: null,
        }),
    }),
    {
      name: "auth-storage",
      // The server has no localStorage, so the first client render must be logged out
      // too (hydration). _app rehydrates in a layout effect right after hydration.
      skipHydration: true,
      partialize: (state) => ({
        jwt: state.jwt,
        inviteToken: state.inviteToken,
        jwtDecoded: state.jwtDecoded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);
