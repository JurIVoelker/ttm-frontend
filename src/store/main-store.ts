import { TeamDTO } from "@/types/team";
import { create } from "zustand";

export type Store = {
  teamSlug: string | null;
  setTeamSlug: (slug: string | null) => void;
  teams: TeamDTO[];
  setTeams: (teams: TeamDTO[]) => void;
  teamsLoaded: boolean;
  reset: () => void;
};

export const mainStore = create<Store>()((set) => ({
  teamSlug: null,
  setTeamSlug: (slug: string | null) => set({ teamSlug: slug }),
  teams: [],
  setTeams: (teams: TeamDTO[]) => set({ teams, teamsLoaded: true }),
  teamsLoaded: false,
  reset: () =>
    set({
      teamSlug: null,
      teams: [],
      teamsLoaded: false,
    }),
}));
