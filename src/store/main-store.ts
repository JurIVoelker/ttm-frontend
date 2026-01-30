import { TeamDTO } from "@/types/team";
import { create } from "zustand";

export type Store = {
  teamSlug: string | null;
  setTeamSlug: (slug: string) => void;
  teams: TeamDTO[];
  setTeams: (teams: TeamDTO[]) => void;
  reset: () => void;
};

export const mainStore = create<Store>()((set) => ({
  teamSlug: null,
  setTeamSlug: (slug: string) => set({ teamSlug: slug }),
  teams: [],
  setTeams: (teams: TeamDTO[]) => set({ teams }),
  reset: () =>
    set({
      teamSlug: null,
      teams: [],
    }),
}));
