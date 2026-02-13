import { PlayerGroup } from "@/lib/player.sort";
import { PlayerOfTeamDTO } from "@/types/player";
import { expect, test } from "bun:test"

const getPlayer = ({ pos, teamIndex }: { pos: number, teamIndex: number }): PlayerOfTeamDTO => {
  const playerId = Bun.randomUUIDv7();
  return {
    fullName: `Player ${teamIndex}-${pos}`,
    id: playerId,
    position: {
      id: Bun.randomUUIDv7(),
      playerId: playerId,
      teamIndex: teamIndex,
      position: pos,
      teamType: "ERWACHSENE",
    },
  }
}

const p = (teamIndex: number, pos: number) => getPlayer({ pos, teamIndex });


test("Initialize empty team", () => {
  const group = new PlayerGroup({ players: [], type: "ERWACHSENE", minLength: 3 });
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [] },
    { index: 2, teamName: "Erwachsene II", players: [] },
    { index: 3, teamName: "Erwachsene III", players: [] },
  ]);
});

test("Initialize team with players", () => {
  const p1 = p(1, 1);
  const p2 = p(2, 2);
  const p3 = p(2, 1);
  const group = new PlayerGroup({ players: [p1, p2, p3], type: "ERWACHSENE" });
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [p1] },
    { index: 2, teamName: "Erwachsene II", players: [p3, p2] },
  ]);
});

test("Remove player", () => {
  const p1 = p(1, 1);
  const p2 = p(1, 2);
  const p3 = p(1, 3);
  const group = new PlayerGroup({ players: [p1, p2, p3], type: "ERWACHSENE" });
  group.removePlayer(p2.id);
  p3.position!.position = 2;
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [p1, p3] },
  ]);
});

test("Add player", () => {
  const p1 = p(1, 1);
  const p2 = p(1, 2);
  const group = new PlayerGroup({ players: [p1, p2], type: "ERWACHSENE" });
  const p3 = p(1, 3);
  group.addPlayer(p3, 1, 2);
  p2.position!.position = 3;
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [p1, p3, p2] },
  ]);
});

test("Move within group", () => {
  const p1 = p(1, 1);
  const p2 = p(1, 2);
  const p3 = p(1, 3);
  const group = new PlayerGroup({ players: [p1, p2, p3], type: "ERWACHSENE" });
  group.movePlayer({ overId: p2.id, activeId: p1.id });
  p1.position!.position = 2;
  p2.position!.position = 1;
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [p2, p1, p3] },
  ]);
});

test("Move within group backwards", () => {
  const p1 = p(1, 1);
  const p2 = p(1, 2);
  const p3 = p(1, 3);
  const group = new PlayerGroup({ players: [p1, p2, p3], type: "ERWACHSENE" });
  group.movePlayer({ overId: p2.id, activeId: p3.id });
  p2.position!.position = 3;
  p3.position!.position = 2;
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [p1, p3, p2] },
  ]);
});

test("Move between groups", () => {
  const p1 = p(1, 1);
  const p2 = p(2, 1);
  const p3 = p(2, 2);
  const group = new PlayerGroup({ players: [p1, p2, p3], type: "ERWACHSENE" });
  group.movePlayer({ overId: p2.id, activeId: p1.id });
  p1.position!.position = 1;
  p1.position!.teamIndex = 2;
  p2.position!.position = 2;
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [] },
    { index: 2, teamName: "Erwachsene II", players: [p1, p2, p3] },
  ]);
});

test("Move to empty group", () => {
  const p1 = p(1, 1);
  const p2 = p(1, 2);
  const group = new PlayerGroup({ players: [p1, p2], type: "ERWACHSENE", minLength: 2 });
  group.movePlayer({ overId: "team-2", activeId: p2.id });
  p2.position!.teamIndex = 2;
  p2.position!.position = 1;
  expect(group.group).toEqual([
    { index: 1, teamName: "Erwachsene I", players: [p1] },
    { index: 2, teamName: "Erwachsene II", players: [p2] },
  ]);
});



