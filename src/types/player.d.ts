import { TeamType } from "./team";

export type PlayerOfTeamDTO = {
  id: string;
  fullName: string;
  position?: {
    id: string;
    playerId: string;
    teamIndex: number;
    position: number;
    teamType: TeamType;
  };
};

export type PlayerDTO = {
  id: string;
  fullName: string;
  positions: {
    id: string;
    playerId: string;
    teamIndex: number;
    position: number;
    teamType: TeamType;
  }[];
};
