import { PlayersOfTeamDTO } from "@/types/player";
import { TeamDTO, TeamPositionsDTO, TeamType } from "@/types/team";
import { intToRoman } from "./romanUtils";
import { mainStore } from "@/store/main-store";

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

export const groupPlayersByTeam = (players: PlayersOfTeamDTO[], minLength?: number) => {
  const groupedTeams: {
    index: number;
    teamName: string;
    players: PlayersOfTeamDTO[];
  }[] = [];

  const sortedPlayers = players.sort((a, b) => {
    const priorityA = a.position === undefined ? 0 : 1000 * a.position.teamIndex + a.position.position;
    const priorityB = b.position === undefined ? 0 : 1000 * b.position.teamIndex + b.position.position;
    return priorityA - priorityB;
  })

  const teams = mainStore.getState().teams;

  let name = "Mannschaft";

  for (let i = 0; i < sortedPlayers.length; i++) {
    const player = sortedPlayers[i]
    const existingEntry = groupedTeams.find(
      (pos) => pos.index === player.position?.teamIndex,
    );

    if (name === "Mannschaft" && player.position?.teamType) {
      name = translateTeamType(player.position.teamType);
    }

    if (existingEntry) {
      existingEntry.players.push(player);
      continue;
    }


    const missingTeamCount = player.position?.teamIndex ? player.position.teamIndex - groupedTeams.length : 0;
    console.table({ missingTeamCount, i, player: player.fullName })
    if (missingTeamCount > 1) {
      for (let j = 1; j <= missingTeamCount; j++) {
        groupedTeams.push({
          index: i + j,
          teamName: `${name} ${intToRoman(i + j)}`,
          players: [],
        });
      }
    }

    const teamName =
      teams.find(
        (t) =>
          t.type === player.position?.teamType &&
          t.groupIndex === player.position?.teamIndex,
      )?.name || `${name} ${intToRoman(player.position?.teamIndex || 0)}`;

    groupedTeams.push({
      index: player.position?.teamIndex || 0,
      teamName,
      players: [player],
    });

  }

  if (minLength) {
    for (let i = 1; i <= minLength - groupedTeams.length; i++) {
      groupedTeams.push({
        index: groupedTeams.length + 1 + i,
        teamName: `${name} ${intToRoman(groupedTeams.length + 1)}`,
        players: [],
      });
    }
  }

  return groupedTeams;
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