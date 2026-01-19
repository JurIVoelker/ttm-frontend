import {
  Availability,
  MatchAvailabilityVote,
  MatchDTO,
  MatchesDTO,
} from "@/types/match";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { MoreHorizontal, XIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Calendar02Icon,
  Copy01Icon,
  LeftToRightListNumberIcon,
  Location01Icon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { useEffect, useState } from "react";
import {
  isAdmin,
  isLeader,
  isLeaderOfTeam,
  isPlayerOfTeam,
} from "@/lib/permission";
import useAuthStore from "@/hooks/use-auth-store";
import GameAvailabilityDialog from "./game-availability-dialog";
import { PlayersOfTeamDTO } from "@/types/player";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { getInfoTextString } from "@/lib/match";
import { showMessage } from "@/lib/message";
import { useRouter } from "next/router";
import { mainStore } from "@/store/main-store";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MatchListProps {
  matches: MatchesDTO;
  allPlayers: PlayersOfTeamDTO[];
}

const MatchList = ({ matches, allPlayers }: MatchListProps) => (
  <div className="space-y-2 pb-6 md:grid md:grid-cols-2 lg:grid-cols-3">
    {matches.map((match) => (
      <MatchListItem key={match.id} match={match} allPlayers={allPlayers} />
    ))}
  </div>
);

const MatchListItem = ({
  match,
  allPlayers,
}: {
  match: MatchDTO;
  allPlayers: PlayersOfTeamDTO[];
}) => {
  const { authStore } = useAuthStore();

  const playersVote = match.matchAvailabilityVotes.find(
    (vote) => vote.playerId === authStore?.jwtDecoded?.player?.id,
  );

  return (
    <Card>
      <MatchCardHeader
        title={match.enemyName}
        match={match}
        allPlayers={allPlayers}
      />
      <CardContent className="space-y-6">
        <MatchInfo match={match} />
        <LineupInfo match={match} />
      </CardContent>
      <MatchAvailability
        defaultValue={playersVote?.availability}
        votes={match.matchAvailabilityVotes}
        allPlayers={allPlayers}
      />
    </Card>
  );
};

const MatchCardHeader = ({
  title,
  match,
  allPlayers,
}: {
  title: string;
  match: MatchDTO;
  allPlayers: PlayersOfTeamDTO[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { push } = useRouter();

  const onCopy = () => {
    const text = getInfoTextString(match, allPlayers);
    if (!text) {
      showMessage("Fehler beim Erstellen des Infotextes");
      return;
    }
    navigator.clipboard.writeText(text);
    showMessage("Infotext in die Zwischenablage kopiert");
  };
  const onEditMatch = () => {
    const teamSlug = mainStore.getState().teamSlug;
    push(`${teamSlug}/spiele/${match.id}/bearbeiten`);
  };
  const onEditLineup = () => {
    const teamSlug = mainStore.getState().teamSlug;
    push(`${teamSlug}/spiele/${match.id}/aufstellung`);
  };
  const onDeleteMatch = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <CardHeader>
        <CardTitle className="flex justify-between h-8 items-center">
          {title}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2">
              <DropdownMenuItem
                onClick={onCopy}
                disabled={match.lineup.length === 0}
              >
                <Copy01Icon strokeWidth={2} />
                Infotext kopieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEditMatch}>
                <PencilEdit02Icon strokeWidth={2} />
                Spieldaten anpassen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEditLineup}>
                <LeftToRightListNumberIcon strokeWidth={2} />
                Aufstellung bearbeiten
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setIsOpen(true)}
              >
                <XIcon strokeWidth={2} />
                Spiel löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Spiel gegen {match?.enemyName} löschen
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bist du dir sicher, dass du das Spiel löschen möchtest?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteMatch}>
            Spiel löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const MatchInfo = ({ match }: { match: MatchDTO }) => (
  <div className="space-y-2">
    <div className=" mb-3 space-x-2">
      <Badge>{match.isHomeGame ? "Heimspiel" : "Auswärtsspiel"}</Badge>
      {match.type === "CUP" && <Badge>Pokalspiel</Badge>}
    </div>
    <MatchInfoItem
      Icon={Calendar02Icon}
      content={`${format(new Date(match.time), "dd.MM.yyyy")} um ${format(new Date(match.time), "HH:mm")} Uhr`}
    />
    <MatchInfoItem
      Icon={Location01Icon}
      content={`${match.location?.hallName || "Unbekannt"}, ${match.location?.city || "Unbekannt"}, ${match.location?.streetAddress || "Unbekannt"}`}
    />
  </div>
);

const MatchInfoItem = ({
  Icon,
  content,
}: {
  Icon: React.ComponentType<React.ComponentProps<typeof Calendar02Icon>>;
  content: React.ReactNode;
}) => {
  return (
    <div className="flex gap-1.5 text-sm items-center">
      <Icon className="shrink-0 size-5 text-muted-foreground" strokeWidth={2} />
      <div>{content}</div>
    </div>
  );
};

const LineupInfo = ({ match }: { match: MatchDTO }) => {
  const { lineup } = match;
  const noLineup = lineup.length === 0;
  const showSelectLineup = noLineup && isLeaderOfTeam();
  const showNoLineup = !showSelectLineup && noLineup;

  return (
    <div>
      <h3 className="text-sm font-semibold">Aufstellung</h3>
      {showSelectLineup && (
        <div className="mt-2 text-sm text-muted-foreground">
          Keine Aufstellung vorhanden. Wähle eine Aufstellung aus.
          <Link
            href={`${mainStore.getState().teamSlug}/spiele/${match.id}/aufstellung`}
            className={cn(
              "w-full mt-1.5",
              buttonVariants({
                variant: "secondary",
              }),
            )}
          >
            <LeftToRightListNumberIcon />
            Auswählen
          </Link>
        </div>
      )}
      {showNoLineup && (
        <div className="mt-2 text-sm text-muted-foreground">
          Keine Aufstellung vorhanden.
        </div>
      )}
      {!noLineup && <>todo</>}
    </div>
  );
};

const MatchAvailability = ({
  defaultValue,
  allPlayers,
  votes,
}: {
  defaultValue?: Availability;
  votes: MatchAvailabilityVote[];
  allPlayers: PlayersOfTeamDTO[];
}) => {
  const [availability, setAvailability] = useState<Availability>(
    defaultValue || "NOT_RESPONDED",
  );
  const leaderButNotPlayer = isLeader() && !isPlayerOfTeam();
  const hideContent = !isPlayerOfTeam() && !isAdmin() && !isLeader();

  useEffect(() => {
    if (defaultValue) {
      setAvailability(defaultValue);
    }
  }, [defaultValue]);

  if (hideContent) return null;

  const onVote = (availability: Availability) => {
    setAvailability(availability);
  };

  return (
    <CardFooter className="block">
      <h3 className="text-sm font-semibold mb-3">
        {leaderButNotPlayer
          ? "Abstimmungen der Spieler"
          : "Hast du Zeit zu spielen?"}
      </h3>
      {isPlayerOfTeam() && (
        <div className="flex gap-2">
          <Button
            className="grow"
            variant={availability === "AVAILABLE" ? "positive" : "outline"}
            onClick={() => onVote("AVAILABLE")}
          >
            Ja
          </Button>
          <Button
            className="grow"
            variant={availability === "UNKNOWN" ? "neutral" : "outline"}
            onClick={() => onVote("UNKNOWN")}
          >
            Vielleicht
          </Button>
          <Button
            className="grow"
            variant={availability === "UNAVAILABLE" ? "negative" : "outline"}
            onClick={() => onVote("UNAVAILABLE")}
          >
            Nein
          </Button>
        </div>
      )}
      <GameAvailabilityDialog allPlayers={allPlayers} votes={votes} />
    </CardFooter>
  );
};

export default MatchList;
