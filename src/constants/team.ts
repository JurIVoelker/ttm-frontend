import { TeamType } from "@/types/team";

export const TEAM_TYPES: TeamType[] = [
  "DAMEN",
  "ERWACHSENE",
  "JUGEND_12",
  "JUGEND_15",
  "JUGEND_19",
  "MADCHEN_12",
  "MADCHEN_15",
  "MADCHEN_19",
];

export const translateTeamType = (type: TeamType): string => {
  switch (type) {
    case "DAMEN":
      return "Damen";
    case "ERWACHSENE":
      return "Erwachsene";
    case "JUGEND_12":
      return "Jugend U12";
    case "JUGEND_15":
      return "Jugend U15";
    case "JUGEND_19":
      return "Jugend U19";
    case "MADCHEN_12":
      return "Mädchen U12";
    case "MADCHEN_15":
      return "Mädchen U15";
    case "MADCHEN_19":
      return "Mädchen U19";
    default:
      return "Unbekannt";
  }
};
