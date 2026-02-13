import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusSignIcon } from "hugeicons-react";
import { PlayerOfTeamDTO } from "@/types/player";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { TeamPositionsDTO } from "@/types/team";

interface ConfirmDialogProps {
  onAddPlayer: (player: PlayerOfTeamDTO) => void;
  children?: React.ReactNode;
  teamGroups?: TeamPositionsDTO[];
}

const AddPlayerDialog = ({
  onAddPlayer,
  children,
  teamGroups,
}: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

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
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Spieler hinzufügen</DialogTitle>
          <Command className="w-full rounded-lg border relative">
            <CommandInput placeholder="Spielername eingeben" />
            <CommandList className="max-h-40">
              <CommandEmpty>Neuer Spieler</CommandEmpty>
              <CommandGroup heading="Vorschläge">
                {/* {players?.map((player) => (
                  <CommandItem
                    key={player.id}
                    onSelect={() => {
                      onAddPlayer(player);
                      setOpen(false);
                    }}
                  >
                    {player.fullName}
                  </CommandItem>
                ))} */}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerDialog;
