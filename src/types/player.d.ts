import { TeamType } from "./team";

export type PlayersOfTeamDTO = {
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
