import { PlayersOfTeamDTO } from "./player";

export type TeamDTO = {
  name: string;
  slug: string;
  groupIndex: number;
  type: TeamType;
};

export type TeamType =
  | "DAMEN"
  | "ERWACHSENE"
  | "JUGEND_12"
  | "JUGEND_15"
  | "JUGEND_19"
  | "MADCHEN_12"
  | "MADCHEN_15"
  | "MADCHEN_19";

export type TeamPositionsDTO = {
  teamType: TeamType;
  players: PlayersOfTeamDTO[];
};
