import { PlayersOfTeamDTO } from "@/types/player";
import { TeamDTO, TeamPositionsDTO, TeamType } from "@/types/team";
import { intToRoman } from "./romanUtils";

interface GroupedTeamPlayers {
  currentTeam?: TeamDTO;
  allPositions: TeamPositionsDTO[];
  teams: TeamDTO[];
}

export const groupPlayersToOtherTeams = ({ currentTeam, allPositions, teams }: GroupedTeamPlayers) => {
  const targetTeamType = allPositions.find(
    (t) => t?.teamType === currentTeam?.type,
  );

  const otherTeamPositions: {
    index: number;
    teamName: string;
    players: PlayersOfTeamDTO[];
  }[] = [];

  for (const position of targetTeamType?.players || []) {
    if (!position.position || !currentTeam) continue;
    if (position.position?.teamType !== currentTeam?.type) continue;
    if (position.position?.teamIndex <= currentTeam?.groupIndex) continue;
    const existingEntry = otherTeamPositions.find(
      (pos) => pos.index === position.position?.teamIndex,
    );
    if (existingEntry) {
      existingEntry.players.push(position);
    } else {
      const teamName =
        teams.find(
          (t) =>
            t.type === position.position?.teamType &&
            t.groupIndex === position.position?.teamIndex,
        )?.name || `Team ${position.position?.teamIndex}`;
      otherTeamPositions.push({
        index: position.position?.teamIndex,
        teamName,
        players: [position],
      });
    }
  }

  return otherTeamPositions;
}

export const translateTeamType = (teamType: TeamType) => {
  if (teamType === "ERWACHSENE") return "Erwachsene";
  if (teamType === "DAMEN") return "Damen";
  if (teamType.startsWith("JUGEND")) {
    const age = teamType.split("_")[1];
    return `Jugend U${age}`;
  }
  if (teamType.startsWith("MADCHEN")) {
    const age = teamType.split("_")[1];
    return `Mädchen U${age}`;
  }

  return teamType;
}

export const getTeamName = (teamType: TeamType, index: number) => {
  const translatedType = translateTeamType(teamType);
  return `${translatedType} ${intToRoman(index)}`;
}