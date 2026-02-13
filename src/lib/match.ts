import { MatchDTO } from "@/types/match";
import { PlayerOfTeamDTO } from "@/types/player";
import { format } from "date-fns";

export const getWeekdayName = (date: Date) => {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
  }).format(date);
};

export const getInfoTextString = (
  match: MatchDTO,
  players: PlayerOfTeamDTO[],
) => {
  if (
    !match?.time ||
    !match?.enemyName ||
    typeof match?.isHomeGame !== "boolean" ||
    !Array.isArray(match?.lineup)
  ) {
    return null;
  }

  const daysUntilMatch = Math.ceil(
    (new Date(match.time).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24),
  );

  const dateString = format(new Date(match.time), "dd.MM.yyyy");
  const timeString = format(new Date(match.time), "HH:mm");
  let textBeginning = "";
  if (daysUntilMatch > 7 || daysUntilMatch < 0) {
    textBeginning = `Am ${getWeekdayName(
      new Date(match.time),
    )}, dem ${dateString} um ${timeString}`;
  } else if (daysUntilMatch > 1) {
    textBeginning = `Am ${getWeekdayName(new Date(match.time))} (${dateString}) um ${timeString}`;
  } else if (daysUntilMatch === 1) {
    textBeginning = `Morgen (${dateString}) um ${timeString}`;
  } else if (daysUntilMatch === 0) {
    textBeginning = `Heute um ${timeString}`;
  }

  return `${textBeginning} Uhr findet das ${match.isHomeGame ? "Heimspiel" : "Auswärtsspiel"
    } gegen ${match.enemyName
    } statt. Wir spielen mit folgender Aufstellung: \n${match.lineup
      .map(
        (lineup, index) =>
          ` - ${index + 1}. ${players.find((p) => p.id === lineup.id)?.fullName || "Unbekannt"}`,
      )
      .join("\n")}`;
};
