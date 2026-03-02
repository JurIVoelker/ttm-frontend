import { isAdmin, isLeaderOfTeam } from "@/lib/permission";
import { ArrowRight01Icon, Copy01Icon } from "hugeicons-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MatchDTO } from "@/types/match";
import { getInfoTextString } from "@/lib/match";
import { PlayerOfTeamDTO } from "@/types/player";
import { showMessage } from "@/lib/message";

const CopyAllMatchInfo = ({
  matches,
  players,
}: {
  matches: MatchDTO[];
  players: PlayerOfTeamDTO[];
}) => {
  if (!isAdmin() || !isLeaderOfTeam()) {
    return <div className="my-3 w-full h-px" />;
  }

  const onCopy = () => {
    const matchesWithLineup = matches.filter((m) => m.lineup.length > 0);
    if (matchesWithLineup.length === 0) {
      showMessage("Es gibt keine Spiele mit Aufstellung zum Kopieren", {
        variant: "error",
      });
      return;
    }
    const infoTextStrings = matchesWithLineup
      .map((match) => getInfoTextString(match, players))
      .filter((str): str is string => str !== null);
    const finalText = infoTextStrings.join("\n\n");
    navigator.clipboard.writeText(finalText);
    showMessage("Infotexte wurden in die Zwischenablage kopiert");
  };

  return (
    <Dialog>
      <div className="w-full justify-center flex my-3">
        <DialogTrigger asChild>
          <Button variant="ghost-muted" size="sm" className="gap-1">
            Weitere Optionen
            <ArrowRight01Icon
              strokeWidth={2}
              className={cn("animate-pop-in")}
            />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogTitle>Weitere Optionen</DialogTitle>
        <DialogDescription>
          Infotext für alle Spiele mit Aufstellung kopieren:
        </DialogDescription>
        <Button onClick={onCopy}>
          <Copy01Icon strokeWidth={2} /> Kopieren
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CopyAllMatchInfo;
