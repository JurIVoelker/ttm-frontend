import { ChatStatus } from "@/hooks/use-chat";
import { Loader2Icon } from "lucide-react";

const toolLabels: Record<string, string> = {
  list_teams: "Lade Mannschaften",
  get_team: "Lade Mannschaft",
  list_players: "Lade Spieler",
  get_player: "Lade Spieler",
  list_matches: "Lade Spiele",
  get_match: "Lade Spiel",
  find_colliding_matches: "Prüfe Spielkollisionen",
  list_leaders: "Lade Mannschaftsführer",
  list_admins: "Lade Admins",
  get_my_permissions: "Prüfe Berechtigungen",
};

const labelOf = (status: ChatStatus) => {
  switch (status.state) {
    case "thinking":
      return "Denkt nach";
    case "tool":
      return toolLabels[status.toolName] ?? "Lade Daten";
    case "verifying":
      return "Prüft die Antwort auf Vollständigkeit";
    case "revising":
      return "Korrigiert die Antwort";
    default:
      return null;
  }
};

const ChatStatusIndicator = ({ status }: { status: ChatStatus }) => {
  const label = labelOf(status);
  if (!label) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
      <Loader2Icon className="size-4 animate-spin" />
      {label} …
    </div>
  );
};

export default ChatStatusIndicator;
