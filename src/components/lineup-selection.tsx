import { cn } from "@/lib/utils";
import { SingleMatchDTO } from "@/types/match";
import { PlayersOfTeamDTO } from "@/types/player";
import { Tick01Icon } from "hugeicons-react";
import { PlusIcon, XIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const LineupSelection = ({
  match,
  players,
  onSelectPlayer,
  onRemovePlayer,
}: {
  match?: SingleMatchDTO | null;
  players?: PlayersOfTeamDTO[];
  onSelectPlayer: (player: PlayersOfTeamDTO) => void;
  onRemovePlayer: (player: PlayersOfTeamDTO) => void;
}) => {
  console.log({ lineupinside: match?.lineup });

  const replacementPlayers = match?.lineup?.filter((lp) =>
    players?.every((p) => p.id !== lp.id),
  );

  return (
    <>
      <div className="text-sm space-y-1.5 mt-2">
        {players?.map((p) => {
          const isSelected = match?.lineup?.some((lp) => lp.id === p.id);
          const availability =
            match?.matchAvailabilityVotes.find((vote) => vote.playerId === p.id)
              ?.availability || "NOT_RESPONDED";

          return (
            <button
              key={p.id}
              className={cn(
                "rounded-md w-full py-1.5 px-1.5 bg-background text-left border flex gap-1.5 items-center",
                isSelected &&
                  "bg-primary text-primary-foreground border-primary",
              )}
              onClick={() => {
                onSelectPlayer(p);
              }}
            >
              <Tick01Icon
                className={cn(
                  "shrink-0 size-5 animate-pop-in",
                  !isSelected && "hidden",
                )}
                strokeWidth={2}
              />
              <PlusIcon
                className={cn(
                  "shrink-0 size-5 animate-fade-in-rotate",
                  isSelected && "hidden",
                )}
                strokeWidth={2}
              />
              {p.fullName}
              {availability === "AVAILABLE" && (
                <Badge
                  variant="positive"
                  className="ml-auto transition-none"
                  transparent={isSelected}
                >
                  Hat Zeit
                </Badge>
              )}
              {availability === "UNAVAILABLE" && (
                <Badge
                  variant="negative"
                  className="ml-auto transition-none"
                  transparent={isSelected}
                >
                  Keine Zeit
                </Badge>
              )}
              {availability === "UNKNOWN" && (
                <Badge
                  variant="neutral"
                  className="ml-auto transition-none"
                  transparent={isSelected}
                >
                  Vielleicht
                </Badge>
              )}
              {availability === "NOT_RESPONDED" && (
                <Badge
                  variant="outline"
                  className="ml-auto transition-none"
                  transparent={isSelected}
                >
                  Unbekannt
                </Badge>
              )}
            </button>
          );
        })}
        {replacementPlayers?.map((p) => (
          <div key={p.id} className="flex gap-1.5">
            <div className="bg-primary text-primary-foreground grow rounded-md flex items-center px-1.5 gap-1">
              <Tick01Icon className="size-5 shrink-0" strokeWidth={2} />
              {p.fullName} (Ersatz)
            </div>
            <Button size="icon" onClick={() => onRemovePlayer(p)}>
              <XIcon />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default LineupSelection;
