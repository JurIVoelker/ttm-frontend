import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusSignIcon } from "hugeicons-react";
import { PlayerDTO, PlayerOfTeamDTO } from "@/types/player";
import { useEffect, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { TeamType } from "@/types/team";
import { translateTeamType } from "@/constants/team";
import { cn } from "@/lib/utils";
import { showMessage } from "@/lib/message";

interface AddPlayerDialogProps {
  onAddPlayer: (player: PlayerOfTeamDTO) => void;
  children?: React.ReactNode;
  allPlayers: PlayerDTO[];
  targetTeamType: TeamType;
  teamIndex: number;
  teamPosition: number;
}

const AddPlayerDialog = ({
  onAddPlayer,
  allPlayers,
  targetTeamType,
  teamIndex,
  teamPosition,
}: AddPlayerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [commandValue, setCommandValue] = useState("");

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCommandValue("");
      }, 200);
    }
  }, [open]);

  const handleAddPlayer = (player: PlayerDTO) => {
    const isInTeamType = player.positions.some(
      (pos) => pos.teamType === targetTeamType,
    );
    if (isInTeamType) {
      showMessage(
        `Dieser Spieler ist bereits in einer ${translateTeamType(targetTeamType)} Mannschaft. Entferne ihn zuerst oder verschiebe ihn in die gewünschte Mannschaft.`,
        {
          variant: "error",
        },
      );
      return;
    }

    const playerOfTeam: PlayerOfTeamDTO = {
      id: player.id,
      fullName: player.fullName,
      position: {
        id: crypto.randomUUID(),
        playerId: player.id,
        teamIndex,
        position: teamPosition,
        teamType: targetTeamType,
      },
    };

    onAddPlayer(playerOfTeam);
    setOpen(false);
  };

  const onAddNewPlayer = () => {
    const playerId = crypto.randomUUID();

    const existingPlayer = allPlayers.find(
      (player) =>
        player.fullName.toLowerCase() === commandValue.trim().toLowerCase(),
    );

    if (existingPlayer) {
      showMessage(
        `Ein Spieler mit dem Namen "${existingPlayer.fullName}" existiert bereits. Bitte wähle diesen Spieler aus der Liste aus.`,
        {
          variant: "error",
        },
      );
      return;
    }

    const playerOfTeam: PlayerOfTeamDTO = {
      id: playerId,
      fullName: commandValue.trim(),
      position: {
        id: crypto.randomUUID(),
        playerId,
        teamIndex,
        position: teamPosition,
        teamType: targetTeamType,
      },
    };

    onAddPlayer(playerOfTeam);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-1 w-full"
          onClick={() => setOpen(true)}
        >
          <PlusSignIcon strokeWidth={2} />
          Neuen Spieler hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Spieler hinzufügen</DialogTitle>
          <DialogDescription className="text-left">
            Ausgegraute Spieler sind bereits in einer{" "}
            {translateTeamType(targetTeamType)} Mannschaft.
          </DialogDescription>
          <Command className="w-full rounded-lg border mt-2">
            <CommandInput
              placeholder="Spielername eingeben..."
              value={commandValue}
              onValueChange={setCommandValue}
            />
            <CommandList className="max-h-37">
              <CommandGroup heading="Vorschläge" className="text-left">
                {allPlayers?.map((player) => (
                  <CommandItem
                    key={player.id}
                    onSelect={() => handleAddPlayer(player)}
                    className={cn(
                      player.positions.some(
                        (pos) => pos.teamType === targetTeamType,
                      ) && "opacity-50",
                    )}
                  >
                    {player.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={!commandValue.trim()} onClick={onAddNewPlayer}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerDialog;

/* {players?.map((player) => (
                  <CommandItem
                    key={player.id}
                    onSelect={() => {
                      onAddPlayer(player);
                      setOpen(false);
                    }}
                  >
                    {player.fullName}
                  </CommandItem>
                ))} */
