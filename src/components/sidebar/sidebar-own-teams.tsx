import useAuthStore from "@/hooks/use-auth-store";
import { mainStore } from "@/store/main-store";
import { Skeleton } from "../ui/skeleton";
import { SidebarGroup, SidebarGroupLabel } from "../ui/sidebar";
import { Button } from "../ui/button";
import { getButtonStyles } from "./sidebar-team-group";
import { TeamDTO } from "@/types/team";
import { StarIcon } from "hugeicons-react";
import { Crown } from "lucide-react";

const SidebarOwnTeams = ({
  onClickTeam,
}: {
  onClickTeam: (team: TeamDTO) => void;
}) => {
  const teams = mainStore((state) => state.teams);
  const { authStore, loading } = useAuthStore();
  const currentSlug = mainStore((state) => state.teamSlug);

  const { leader, player } = authStore?.jwtDecoded || {};

  const leaderTeams = teams.filter((team) =>
    leader?.teams?.includes(team.slug),
  );

  const playerTeams = teams.filter(
    (team) =>
      player?.teams?.includes(team.slug) && !leader?.teams?.includes(team.slug),
  );

  const isSomeMemeber = leaderTeams.length > 0 || playerTeams.length > 0;

  return (
    <SidebarGroup>
      {loading && (
        <>
          <SidebarGroupLabel>Meine Mannschaften</SidebarGroupLabel>
          <LoadingState />
        </>
      )}
      {!loading && isSomeMemeber && (
        <>
          <SidebarGroupLabel>Meine Mannschaften</SidebarGroupLabel>
          {leaderTeams.map((team) => (
            <Button
              className={getButtonStyles(currentSlug === team.slug)}
              onClick={() => onClickTeam(team)}
              key={team.slug}
            >
              <Crown strokeWidth={2} />
              {team.name}
            </Button>
          ))}
          {playerTeams.map((team) => (
            <Button
              className={getButtonStyles(currentSlug === team.slug)}
              onClick={() => onClickTeam(team)}
              key={team.slug}
            >
              <StarIcon strokeWidth={2} />
              {team.name}
            </Button>
          ))}
        </>
      )}
    </SidebarGroup>
  );
};

const LoadingState = () => <Skeleton className="h-10 w-full" />;

export default SidebarOwnTeams;
