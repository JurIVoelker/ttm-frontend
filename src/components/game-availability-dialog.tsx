"use client";
import { useState } from "react";
import { buttonVariants } from "./ui/button";
import { HelpCircleIcon, Info } from "lucide-react";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { PlayersOfTeamDTO } from "@/types/player";
import { MatchAvailabilityVote } from "@/types/match";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

const GameAvailabilityDialog = ({
  votes,
  allPlayers,
}: {
  votes: MatchAvailabilityVote[];
  allPlayers: PlayersOfTeamDTO[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const notVotedPlayers = allPlayers.filter(
    (p) => !votes.some((v) => v.playerId === p.id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
        }}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-center",
        )}
        disabled={votes.length === 0}
      >
        {votes.length > 0 ? (
          <>
            <Info />
            Abstimmungen anzeigen ({votes.length})
          </>
        ) : (
          <>Noch keine Abstimmungen</>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Abstimmungen</DialogTitle>
        {votes.length === 0 && <p>Keine Abstimmungen vorhanden.</p>}
        <div className="mt-2 space-y-3">
          {votes.map((vote) => {
            const Icon =
              vote.availability === "AVAILABLE"
                ? Tick01Icon
                : vote.availability === "UNAVAILABLE"
                  ? Cancel01Icon
                  : HelpCircleIcon;

            const bg =
              vote.availability === "AVAILABLE"
                ? "border text-positive-dark border-positive-border bg-positive-light"
                : vote.availability === "UNAVAILABLE"
                  ? "border text-negative-dark border-negative-border bg-negative-light"
                  : "border text-neutral-dark border-neutral-border bg-neutral-light";
            return (
              <div
                key={vote.playerId}
                className={`flex justify-between p-2 rounded px-3 items-center ${bg}`}
              >
                <span className="text-sm">
                  {allPlayers.find((p) => p.id === vote.playerId)?.fullName ||
                    "Unbekannter Spieler"}
                </span>
                <Icon className="size-5" />
              </div>
            );
          })}
        </div>
        {notVotedPlayers.length > 0 && (
          <div className="mt-3">
            <h2 className="text-base font-semibold">Noch nicht abgestimmt:</h2>
            <div className="flex gap-1.5 flex-wrap mt-2.5">
              {notVotedPlayers.map((player) => (
                <Badge
                  key={player.id}
                  variant="outline"
                  className="bg-secondary/30"
                >
                  {player.fullName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameAvailabilityDialog;
