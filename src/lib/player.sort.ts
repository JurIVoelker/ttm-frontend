import { PlayerOfTeamDTO } from "@/types/player";
import { TeamPositionsDTO, TeamType } from "@/types/team";
import { intToRoman } from "./romanUtils";
import { translateTeamType } from "./team";
import { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export class PlayerGroup {
  public group: {
    index: number;
    teamName: string;
    players: PlayerOfTeamDTO[];
  }[] = []

  private type: TeamType;

  public constructor({ players, minLength, type }: { players: PlayerOfTeamDTO[], minLength?: number, type: TeamType }) {
    this.type = type;
    const filteredPlayers = players.filter((player) => player.position?.teamType === type)
    if (filteredPlayers.length !== players.length) {
      console.warn("Some players have a different team type than the group type or no position and will be ignored in the grouping.");
    }

    const teamCount = Math.max(...filteredPlayers.map((p) => p.position?.teamIndex || 0), minLength || 0);
    for (let i = 0; i < teamCount; i++) {
      this.group.push({ index: i + 1, teamName: `${translateTeamType(type)} ${intToRoman(i + 1)}`, players: [] })
    }

    const sortedPlayers = filteredPlayers.sort((a, b) => {
      const priorityA = a.position!.teamIndex * 1000 + a.position!.position;
      const priorityB = b.position!.teamIndex * 1000 + b.position!.position;
      return priorityA - priorityB;
    })

    for (const player of sortedPlayers) {
      const teamIndex = player.position!.teamIndex;
      const team = this.group.find((t) => t.index === teamIndex);
      if (!team) continue;
      team.players.push(player);
    }
  }

  public removePlayer(playerId: string) {
    for (const team of this.group) {
      const playerIndex = team.players.findIndex((p) => p.id === playerId);
      if (playerIndex !== -1) {
        team.players.splice(playerIndex, 1);
        break;
      }
    }

    this.recalculatePositions();
  }

  public addPlayer(player: PlayerOfTeamDTO, teamIndex: number, position: number) {
    const team = this.group.find((t) => t.index === teamIndex);
    if (!team) {
      console.warn(`Team with index ${teamIndex} not found. Player not added.`);
      return;
    }
    team.players.splice(position - 1, 0, player);
    this.recalculatePositions();
  }

  public recalculatePositions() {
    for (const team of this.group) {
      team.players.forEach((player, index) => {
        if (player.position) {
          player.position.position = index + 1;
          player.position.teamIndex = team.index;
        }
      });
    }
  }

  public movePlayer({ overId, activeId }: { overId?: UniqueIdentifier, activeId?: UniqueIdentifier }) {
    const players = this.listPlayers();
    const activePlayer = players.find((p) => p.id === activeId);
    if (!activePlayer) return;

    if (String(overId).startsWith("team-")) {
      const teamIndex = Number(String(overId).split("-")[1]);
      const targetTeam = this.group.find((t) => t.index === teamIndex);
      if (!targetTeam) return;
      this.removePlayer(activePlayer.id);
      this.addPlayer(activePlayer, teamIndex, 1);
      return;
    }

    const overPlayer = players.find((p) => p.id === overId);
    if (!overPlayer || !activePlayer) return;
    const overTeam = this.group.find((t) => t.index === overPlayer.position?.teamIndex);
    const activeTeam = this.group.find((t) => t.index === activePlayer.position?.teamIndex);
    if (!overTeam || !activeTeam) return;

    if (overPlayer.position!.teamIndex === activePlayer.position!.teamIndex) {
      const movedTeam = arrayMove(overTeam.players, activePlayer.position!.position - 1, overPlayer.position!.position - 1);
      overTeam.players = movedTeam;
      this.recalculatePositions();
    } else {
      this.removePlayer(activePlayer.id);
      this.addPlayer(activePlayer, overTeam.index, overPlayer.position!.position);
    }
  }

  public getStateValue(allTeams?: TeamPositionsDTO[]) {
    const filteredTeams = allTeams?.filter((t) => t.teamType !== this.type);
    return {
      teams: [...filteredTeams || [], {
        teamType: this.type,
        players: this.listPlayers(),
      }]
    }
  }

  public listPlayers() {
    return this.group.flatMap((t) => t.players);
  }

  public json() {
    return JSON.stringify(this.group, null, 2);
  }
}