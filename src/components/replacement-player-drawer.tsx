"use client";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { PlusSignIcon, Tick01Icon } from "hugeicons-react";
import { PlayerOfTeamDTO } from "@/types/player";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReplacementPlayerDrawerProps {
  teams: {
    index: number;
    teamName: string;
    players: PlayerOfTeamDTO[];
  }[];
  onSelectPlayers: (players: PlayerOfTeamDTO[]) => void;
  selectedPlayers: PlayerOfTeamDTO[];
  className?: string;
}

const ReplacementPlayerDrawer: React.FC<ReplacementPlayerDrawerProps> = ({
  teams,
  onSelectPlayers,
  selectedPlayers,
  className,
}) => {
  const [players, setPlayers] = useState<PlayerOfTeamDTO[]>([]);

  const selectedReplacementPlayers = selectedPlayers.filter((sp) =>
    teams.every((t) => t.players.every((p) => p.id !== sp.id)),
  );

  const handleSelectPlayer = (playerId: string) => {
    const isSelected = players.some((p) => p.id === playerId);
    if (isSelected) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    } else {
      const playerToAdd = teams
        .flatMap((team) => team.players)
        .find((p) => p.id === playerId);
      if (playerToAdd) {
        setPlayers((prev) => [...prev, playerToAdd]);
      }
    }
  };

  return (
    <Drawer onOpenChange={() => setPlayers(selectedReplacementPlayers)}>
      <DrawerTrigger asChild>
        <Button
          className={cn("w-full mb-6", className)}
          variant="outline"
          disabled={teams.length === 0}
        >
          {teams.length === 0
            ? "Ersatzspieler hinzufügen"
            : "Ersatzspieler hinzufügen"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">
            Ersatzspieler hinzufügen
          </DrawerTitle>
          <DrawerDescription className="text-left">
            Wähle Ersatzspieler aus.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[60vh] overflow-y-scroll px-4 space-y-4 relative">
          {teams.map((team) => (
            <div
              key={team.index}
              className={cn("border rounded-sm p-3 bg-secondary/30")}
            >
              <h2
                className={cn(
                  "font-semibold text-base",
                  "text-muted-foreground font-normal",
                )}
              >
                {team.teamName}
              </h2>
              <div className="text-sm space-y-1.5 mt-2">
                {team.players.map((player) => {
                  const isPlayerSelected = players.some(
                    (p) => p.id === player.id,
                  );
                  const isAlreadyInLineup = selectedPlayers.some(
                    (p) => p.id === player.id,
                  );
                  return (
                    <button
                      className={cn(
                        "rounded-md w-full py-1.5 px-1.5 bg-background text-left border flex gap-1.5 items-center",
                        (isPlayerSelected || isAlreadyInLineup) &&
                          "bg-primary text-primary-foreground border-primary",
                        isAlreadyInLineup && "opacity-50 cursor-not-allowed",
                      )}
                      key={player.id}
                      onClick={() => handleSelectPlayer(player.id)}
                      disabled={isAlreadyInLineup}
                    >
                      <Tick01Icon
                        className={cn(
                          "shrink-0 size-5 animate-pop-in",
                          !isPlayerSelected && !isAlreadyInLineup && "hidden",
                        )}
                        strokeWidth={2}
                      />
                      <PlusSignIcon
                        className={cn(
                          "shrink-0 size-5 animate-fade-in-rotate",
                          isPlayerSelected || isAlreadyInLineup
                            ? "hidden"
                            : undefined,
                        )}
                        strokeWidth={2}
                      />
                      {player.fullName}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose disabled={players?.length ? false : true}>
            <Button
              disabled={players?.length ? false : true}
              className="w-full"
              onClick={() => onSelectPlayers(players)}
            >
              Hinzufügen
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Abbrechen
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReplacementPlayerDrawer;

{
  /* <div
      className={cn(
        "border rounded-sm p-3 bg-secondary/30",
        variant === "highlighted" && "pulse-border",
        className,
      )}
      {...props}
    >
      <h2
        className={cn(
          "font-semibold text-base",
          variant !== "highlighted" && "text-muted-foreground font-normal",
        )}
      >
        {title}
      </h2>
      {variant === "highlighted" && (
        <p className="text-sm text-muted-foreground mb-3">
          Diese Spieler sind in deiner Mannschaft gemeldet.{" "}
        </p>
      )}
      <div className="text-sm space-y-1.5 mt-2">
        {players?.map((p) => {
          const isSelected = selectedPlayers?.some((sp) => sp.id === p.id);

          return (
            <button
              key={p.id}
              className={cn(
                "rounded-md w-full py-1.5 px-1.5 bg-background text-left border flex gap-1.5 items-center",
                isSelected &&
                  "bg-primary text-primary-foreground border-primary",
              )}
              onClick={() => {
                setSelectedPlayers((prev: PlayersOfTeamDTO[]) => {
                  if (isSelected) {
                    return prev.filter((sp) => sp.id !== p.id);
                  } else {
                    return [...prev, p];
                  }
                });
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
            </button>
          );
        })}
      </div>
    </div> */
}
