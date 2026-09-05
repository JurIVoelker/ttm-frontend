import { getInfoTextString } from "@/lib/match";
import { MatchDTO } from "@/types/match";
import { PlayerOfTeamDTO } from "@/types/player";
import { afterEach, expect, setSystemTime, test } from "bun:test";

// Fixed "now": Friday, 05.09.2025 at 10:00 local time.
const NOW = new Date(2025, 8, 5, 10, 0, 0, 0);

afterEach(() => setSystemTime());

const player = (id: string, fullName: string): PlayerOfTeamDTO => ({
  id,
  fullName,
});

const atTime = (daysFromNow: number, hours: number, minutes = 0) => {
  const date = new Date(NOW);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const buildMatch = ({
  time,
  lineup,
}: {
  time: Date;
  lineup: { id: string; fullName: string }[];
}): MatchDTO => ({
  id: "match-1",
  teamSlug: "erwachsene-i",
  type: "REGULAR",
  time,
  enemyName: "TTC Beispiel",
  isHomeGame: true,
  location: null,
  matchAvailabilityVotes: [],
  lineup,
});

const teamPlayers = [player("p1", "Anna Meier"), player("p2", "Ben Schulz")];

test("uses the lineup name for an exchange player that is not in the team", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(3, 19, 30),
    lineup: [
      { id: "p1", fullName: "Anna Meier" },
      { id: "exchange-1", fullName: "Clara Ersatz" },
    ],
  });

  const text = getInfoTextString(match, teamPlayers);

  expect(text).toContain(" - 1. Anna Meier");
  expect(text).toContain(" - 2. Clara Ersatz");
  expect(text).not.toContain("Unbekannt");
});

test("falls back to the team players when the lineup entry has no name", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(3, 19, 30),
    lineup: [{ id: "p2", fullName: "" }],
  });

  expect(getInfoTextString(match, teamPlayers)).toContain(" - 1. Ben Schulz");
});

test("says Unbekannt only when the player cannot be resolved at all", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(3, 19, 30),
    lineup: [{ id: "ghost", fullName: "" }],
  });

  expect(getInfoTextString(match, teamPlayers)).toContain(" - 1. Unbekannt");
});

test("says Heute for a match later today", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(0, 23, 45),
    lineup: [{ id: "p1", fullName: "Anna Meier" }],
  });

  const text = getInfoTextString(match, teamPlayers);

  expect(text).toStartWith("Heute um 23:45 Uhr");
  expect(text).not.toContain("Morgen");
  expect(text).toContain(" - 1. Anna Meier");
  expect(text).not.toContain("Unbekannt");
});

test("says Heute for a match earlier today", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(0, 0, 15),
    lineup: [{ id: "p1", fullName: "Anna Meier" }],
  });

  expect(getInfoTextString(match, teamPlayers)).toStartWith("Heute um 00:15 Uhr");
});

test("says Morgen for a match on the next calendar day", () => {
  setSystemTime(NOW);
  const time = atTime(1, 8, 0);
  const match = buildMatch({
    time,
    lineup: [{ id: "p1", fullName: "Anna Meier" }],
  });

  expect(getInfoTextString(match, teamPlayers)).toStartWith("Morgen (");
});

test("names the weekday for a match within the next week", () => {
  setSystemTime(NOW);
  const time = atTime(3, 19, 30);
  const match = buildMatch({
    time,
    lineup: [{ id: "p1", fullName: "Anna Meier" }],
  });

  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "long" }).format(
    time,
  );
  expect(getInfoTextString(match, teamPlayers)).toStartWith(`Am ${weekday} (`);
});

test("uses the long form for a match more than a week away", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(10, 19, 30),
    lineup: [{ id: "p1", fullName: "Anna Meier" }],
  });

  expect(getInfoTextString(match, teamPlayers)).toContain(", dem ");
});

test("uses the long form for a match in the past", () => {
  setSystemTime(NOW);
  const match = buildMatch({
    time: atTime(-2, 19, 30),
    lineup: [{ id: "p1", fullName: "Anna Meier" }],
  });

  expect(getInfoTextString(match, teamPlayers)).toContain(", dem ");
});

test("copy all: every match keeps correct names and day wording", () => {
  setSystemTime(NOW);
  const matches: MatchDTO[] = [
    buildMatch({
      time: atTime(0, 20, 0),
      lineup: [
        { id: "p1", fullName: "Anna Meier" },
        { id: "exchange-1", fullName: "Clara Ersatz" },
      ],
    }),
    buildMatch({
      time: atTime(1, 18, 0),
      lineup: [{ id: "exchange-2", fullName: "David Ersatz" }],
    }),
  ];

  const finalText = matches
    .filter((m) => m.lineup.length > 0)
    .map((m) => getInfoTextString(m, teamPlayers))
    .filter((str): str is string => str !== null)
    .join("\n\n");

  expect(finalText).not.toContain("Unbekannt");
  expect(finalText).toContain("Heute um 20:00 Uhr");
  expect(finalText).toContain("Morgen (");
  expect(finalText).toContain(" - 2. Clara Ersatz");
  expect(finalText).toContain(" - 1. David Ersatz");
});
