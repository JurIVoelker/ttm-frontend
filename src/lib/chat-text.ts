import { getWeekdayName } from "@/lib/match";
import { ChatMatchCardDTO } from "@/types/chat";
import { format } from "date-fns";

const SPIELE_BLOCK = /```spiele[^\n]*\n([\s\S]*?)```/g;

/** Match ids of all ```spiele blocks in an answer, in order. */
export const matchIdsInAnswer = (markdown: string) =>
  [...markdown.matchAll(SPIELE_BLOCK)].map((m) =>
    m[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

/** One match as plain text, in the style of the match info text. */
export const matchToText = (match: ChatMatchCardDTO) => {
  const time = new Date(match.time);
  const kind = [
    match.isHomeGame ? "Heimspiel" : "Auswärtsspiel",
    match.type === "CUP" ? "Pokalspiel" : null,
  ]
    .filter(Boolean)
    .join(", ");
  const { available, unavailable, unknown, notResponded } = match.availability;

  return [
    `*${match.teamName} gegen ${match.enemyName}* (${kind})`,
    `${getWeekdayName(time)}, ${format(time, "dd.MM.yyyy")} um ${format(time, "HH:mm")} Uhr`,
    match.location
      ? `${match.location.hallName}, ${match.location.streetAddress}, ${match.location.city}`
      : null,
    match.lineup.length > 0
      ? `Aufstellung:\n${match.lineup.map((p, i) => `${i + 1}. ${p.fullName}`).join("\n")}`
      : "Aufstellung: noch keine",
    // Once a lineup is set, votes no longer matter
    match.lineup.length === 0
      ? `Rückmeldungen: ${available} zugesagt, ${unavailable} abgesagt, ${unknown} unsicher, ${notResponded} offen`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
};

/** Markdown table → one line per row ("a · b · c"), header row kept. */
const tableToText = (table: string) =>
  table
    .split("\n")
    .filter((line) => !/^\s*\|?\s*:?-{2,}/.test(line))
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim())
        .join(" · "),
    )
    .join("\n");

/**
 * Plain-text version of an assistant answer for sharing (e.g. WhatsApp):
 * match blocks become match descriptions, tables become lines, Markdown
 * emphasis becomes WhatsApp emphasis (*bold*).
 */
export const chatAnswerToText = (
  markdown: string,
  matchesById: Map<string, ChatMatchCardDTO>,
) => {
  let text = markdown.replace(SPIELE_BLOCK, (_, body: string) =>
    body
      .split("\n")
      .map((id) => matchesById.get(id.trim()))
      .filter((m): m is ChatMatchCardDTO => Boolean(m))
      .map(matchToText)
      .join("\n\n"),
  );

  // Tables: consecutive lines starting with "|"
  text = text.replace(/(?:^\|.*\|[ \t]*(?:\n|$))+/gm, (table) => tableToText(table.trimEnd()) + "\n");

  return text
    .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1") // other code blocks: keep content
    .replace(/^#{1,6}\s+(.+)$/gm, "*$1*") // headings
    .replace(/\*\*(.+?)\*\*/g, "*$1*") // bold
    .replace(/__(.+?)__/g, "*$1*")
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // links
    .replace(/^(\s*)[*+]\s+/gm, "$1- ") // bullet style
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
