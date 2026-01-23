import { PlayersOfTeamDTO } from "@/types/player";
import { TeamDTO, TeamPositionsDTO } from "@/types/team";

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