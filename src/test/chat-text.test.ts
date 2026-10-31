import { chatAnswerToText, matchIdsInAnswer } from "@/lib/chat-text";
import { ChatMatchCardDTO } from "@/types/chat";
import { expect, test } from "bun:test";

const match: ChatMatchCardDTO = {
  id: "m1",
  teamSlug: "Erwachsene-I",
  teamName: "Erwachsene I",
  enemyName: "FC Beispiel",
  // Wednesday, 04.11.2026 19:23 local time
  time: new Date(2026, 10, 4, 19, 23).toISOString(),
  isHomeGame: true,
  type: "CUP",
  location: { hallName: "Sporthalle Mitte", streetAddress: "Musterstraße 1", city: "Berlin" },
  lineup: [
    { id: "p1", fullName: "Anna Abel" },
    { id: "p2", fullName: "Ben Berg" },
  ],
  availability: { available: 2, unavailable: 1, unknown: 0, notResponded: 3 },
};

test("finds match ids of all spiele blocks", () => {
  const md = "a\n```spiele\nm1\nm2\n```\nb\n```spiele\nm3\n```";
  expect(matchIdsInAnswer(md)).toEqual([["m1", "m2"], ["m3"]]);
});

test("replaces match blocks with match descriptions", () => {
  const md = "Das nächste Spiel:\n\n```spiele\nm1\n```\n\nViel Erfolg!";
  expect(chatAnswerToText(md, new Map([["m1", match]]))).toBe(
    [
      "Das nächste Spiel:",
      "",
      "*Erwachsene I gegen FC Beispiel* (Heimspiel, Pokalspiel)",
      "Mittwoch, 04.11.2026 um 19:23 Uhr",
      "Sporthalle Mitte, Musterstraße 1, Berlin",
      "Aufstellung:",
      "1. Anna Abel",
      "2. Ben Berg",
      "",
      "Viel Erfolg!",
    ].join("\n"),
  );
});

test("shows votes only while no lineup is set", () => {
  const text = chatAnswerToText("```spiele\nm1\n```", new Map([["m1", { ...match, lineup: [] }]]));
  expect(text).toContain("Aufstellung: noch keine");
  expect(text).toContain("Rückmeldungen: 2 zugesagt, 1 abgesagt, 0 unsicher, 3 offen");
});

test("skips unknown match ids", () => {
  expect(chatAnswerToText("```spiele\nunknown\n```", new Map())).toBe("");
});

test("converts markdown to WhatsApp-style text", () => {
  const md = [
    "## Mannschaftsführer",
    "**Erwachsene I:** Juri Völker",
    "* Punkt",
    "",
    "| Name | Team |",
    "|---|---|",
    "| Anna | Erwachsene I |",
    "| Ben | Erwachsene II |",
    "",
    "Mehr unter [Link](https://example.com) und `code`.",
  ].join("\n");
  expect(chatAnswerToText(md, new Map())).toBe(
    [
      "*Mannschaftsführer*",
      "*Erwachsene I:* Juri Völker",
      "- Punkt",
      "",
      "Name · Team",
      "Anna · Erwachsene I",
      "Ben · Erwachsene II",
      "",
      "Mehr unter Link (https://example.com) und code.",
    ].join("\n"),
  );
});
