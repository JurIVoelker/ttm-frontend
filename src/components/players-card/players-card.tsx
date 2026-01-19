import { PlayersOfTeamDTO } from "@/types/player";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useAuthStore from "@/hooks/use-auth-store";
import { isAdmin, isLeaderOfTeam, isPlayerOfTeam } from "@/lib/permission";
import { Button, buttonVariants } from "../ui/button";
import {
  Copy01Icon,
  Login02Icon,
  Logout02Icon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { Badge } from "../ui/badge";
import { mainStore } from "@/store/main-store";
import Link from "next/link";
import { useFetchData } from "@/hooks/fetch-data";
import { showMessage } from "@/lib/message";

const PlayersCard = ({ players }: { players: PlayersOfTeamDTO[] }) => {
  const { authStore } = useAuthStore();
  const { teamSlug } = mainStore((state) => state);

  // Permissions
  const leaderOfTeam = isLeaderOfTeam();
  const playerOfTeam = isPlayerOfTeam();
  const admin = isAdmin();
  const showFooter = leaderOfTeam || playerOfTeam;
  const inviteLinkButtonVisible = leaderOfTeam || admin;

  const inviteTokenResponse = useFetchData<{ inviteToken: string }>({
    method: "GET",
    path: `/api/team/${teamSlug}/inviteToken`,
    ready: (leaderOfTeam || admin) && Boolean(teamSlug),
  });

  const inviteToken = inviteTokenResponse.data?.inviteToken;

  const onCopyInviteToken = () => {
    if (inviteToken) {
      const inviteLink = `${window.location.origin}/${teamSlug}/login?inviteToken=${inviteToken}`;
      navigator.clipboard.writeText(inviteLink);
      showMessage("Einladungslink kopiert");
    }
  };

  const playerId = playerOfTeam
    ? players.find((p) => p.id === authStore?.jwtDecoded?.player?.id)?.id
    : null;

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="h-fit">Spieler</span>
          {(leaderOfTeam || admin) && (
            <Link
              href={`/${teamSlug}/spieler`}
              className={buttonVariants({ variant: "default", size: "icon" })}
            >
              <PencilEdit02Icon strokeWidth={2} />
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {players.length === 0 && <>test</>}
        {players?.map((p) => (
          <Badge
            key={p.id}
            variant={p.id === playerId ? "default" : "secondary"}
          >
            {p.id === playerId ? "Du" : p.fullName}
          </Badge>
        ))}
      </CardContent>
      {showFooter && (
        <CardFooter className="flex flex-col gap-1.5 mt-2">
          {inviteLinkButtonVisible && (
            <Button
              className="w-full"
              disabled={inviteTokenResponse.loading || !inviteToken}
              onClick={onCopyInviteToken}
            >
              <Copy01Icon strokeWidth={2} />
              Einladungslink kopieren
            </Button>
          )}
          {playerOfTeam && (
            <Button className="w-full" variant="secondary">
              <Logout02Icon strokeWidth={2} />
              Mannschaft verlassen
            </Button>
          )}
          {!playerOfTeam && leaderOfTeam && (
            <Button className="w-full" variant="secondary">
              <Login02Icon strokeWidth={2} />
              Mannschaft beitreten
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PlayersCard;
