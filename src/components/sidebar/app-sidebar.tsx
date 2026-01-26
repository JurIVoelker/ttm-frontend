import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { TeamDTO, TeamType } from "@/types/team";
import { TEAM_TYPES } from "@/constants/team";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { mainStore } from "@/store/main-store";
import SidebarAllTeams from "./sidebar-all-teams";
import SidebarOwnTeams from "./sidebar-own-teams";
import {
  AddTeamIcon,
  ArrowReloadHorizontalIcon,
  ShieldUserIcon,
  UserCircleIcon,
} from "hugeicons-react";
import { isAdmin, isLeader } from "@/lib/permission";
import ThemeToggle from "../theme-toggle";

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { push } = useRouter();

  const teams = mainStore((state) => state.teams);

  const onClickTeam = (team: TeamDTO) => {
    if (isMobile) {
      toggleSidebar();
    }
    push(`/${team.slug}`);
  };

  const getTeamsByType = (type: TeamType) => {
    return teams.filter((team) => team.type === type) || [];
  };

  const noPlayers = teams.length === 0;

  const groupedTeams: { type: TeamType; teams: TeamDTO[] }[] = TEAM_TYPES.map(
    (t) => ({ type: t, teams: getTeamsByType(t) }),
  );
  const admin = isAdmin();
  const previlegedRole = admin || isLeader();

  return (
    <Sidebar>
      <SidebarContent className={cn("pt-20")}>
        <SidebarOwnTeams onClickTeam={onClickTeam} />
        <SidebarAllTeams
          noPlayers={noPlayers}
          groupedTeams={groupedTeams}
          onClickTeam={onClickTeam}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <ThemeToggle />
          {previlegedRole && (
            <SidebarMenuButton>
              <UserCircleIcon strokeWidth={2} />
              Logout
            </SidebarMenuButton>
          )}
          {admin && (
            <>
              <SidebarMenuButton>
                <AddTeamIcon strokeWidth={2} />
                Mannschaften
              </SidebarMenuButton>
              <SidebarMenuButton>
                <ShieldUserIcon strokeWidth={2} />
                Admins verwalten
              </SidebarMenuButton>
              <SidebarMenuButton>
                <ArrowReloadHorizontalIcon strokeWidth={2} />
                Synchronisation
              </SidebarMenuButton>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
