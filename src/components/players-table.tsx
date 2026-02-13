import { PlayerOfTeamDTO } from "@/types/player";
import { Separator } from "./ui/separator";
import { Fragment } from "react";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { TeamPositionsDTO } from "@/types/team";

interface PlayersTableProps {
  players?: PlayerOfTeamDTO[];
  teams?: TeamPositionsDTO[];
  onRemovePlayer: (player: PlayerOfTeamDTO) => void;
}

interface PlayerTableItemProps {
  player: PlayerOfTeamDTO;
  position: number;
  onRemovePlayer: (player: PlayerOfTeamDTO) => void;
}

const PlayersTable = (props: PlayersTableProps) => {
  const { players, onRemovePlayer } = props;
  return (
    <div className="space-y-1.5">
      {players?.map((player, index) => (
        <Fragment key={player.id}>
          <PlayerTableItem
            player={player}
            position={index + 1}
            onRemovePlayer={onRemovePlayer}
          />
          {index < (players.length || 0) - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
};

const PlayerTableItem = ({
  player,
  position,
  onRemovePlayer,
  ...props
}: PlayerTableItemProps) => {
  return (
    <div {...props} className="w-full flex gap-2 items-center">
      <div className="size-6 flex items-center justify-center bg-secondary/40 rounded-md border">
        {position}
      </div>
      <span>{player.fullName}</span>
      <Button
        variant="destructiveLight"
        size="icon-sm"
        className="ml-auto"
        onClick={() => onRemovePlayer(player)}
      >
        <XIcon />
      </Button>
    </div>
  );
};

export default PlayersTable;
