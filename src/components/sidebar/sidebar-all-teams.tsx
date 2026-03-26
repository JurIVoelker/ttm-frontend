import { TeamDTO } from "@/types/team";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { SidebarTeamGroup } from "./sidebar-team-group";

interface SidebarAllTeamsProps {
  noPlayers: boolean;
  groupedTeams: { label: string; teams: TeamDTO[] }[];
  onClickTeam: (team: TeamDTO) => void;
}

const SidebarAllTeams = ({
  noPlayers,
  groupedTeams,
  onClickTeam,
}: SidebarAllTeamsProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Alle Mannschaften</SidebarGroupLabel>
      <SidebarMenu>
        {noPlayers && <LoadingState />}
        {groupedTeams.map((group) => (
          <SidebarTeamGroup
            key={group.label}
            group={group}
            onClickTeam={onClickTeam}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

const LoadingState = () => (
  <>
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </>
);
export default SidebarAllTeams;
