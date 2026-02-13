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
