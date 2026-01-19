import { Sidebar, SidebarContent, useSidebar } from "../ui/sidebar";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { TeamDTO, TeamType } from "@/types/team";
import { TEAM_TYPES } from "@/constants/team";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { mainStore } from "@/store/main-store";
import SidebarAllTeams from "./sidebar-all-teams";
import SidebarOwnTeams from "./sidebar-own-teams";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
});

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

  return (
    <Sidebar>
      <SidebarContent className={cn("pt-20", poppins.className)}>
        <SidebarOwnTeams onClickTeam={onClickTeam} />
        <SidebarAllTeams
          noPlayers={noPlayers}
          groupedTeams={groupedTeams}
          onClickTeam={onClickTeam}
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
