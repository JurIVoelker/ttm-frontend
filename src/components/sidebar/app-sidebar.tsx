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
  Login02Icon,
  Notification01Icon,
  Settings01Icon,
  UserCircleIcon,
} from "hugeicons-react";
import { isAdmin, isLeader, isPlayer } from "@/lib/permission";
import ThemeToggle from "../theme-toggle";
import useAuthStore from "@/hooks/use-auth-store";
import { sendRequest } from "@/lib/fetch-utils";
import ConfirmDialog from "../confirm-dialog";
import { useState } from "react";
import { showMessage } from "@/lib/message";

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { push } = useRouter();
  const { authStore } = useAuthStore();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const teams = mainStore((state) => state.teams);

  const onClickTeam = (team: TeamDTO) => {
    if (isMobile) {
      toggleSidebar();
    }
    push(`/${team.slug}`);
  };

  const onLogout = async () => {
    await sendRequest({
      method: "POST",
      path: "/api/auth/logout",
    });
    toggleSidebar();
    authStore.reset();
    mainStore.getState().reset();
    showMessage("Erfolgreich abgemeldet.");
    push("/login");
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
  const anyRole = previlegedRole || isPlayer();

  const navigate = (location: string) => {
    if (isMobile) {
      toggleSidebar();
    }
    const path = location.startsWith("/") ? location : "/" + location;
    push(path);
  };

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
            <ConfirmDialog
              title="Logout"
              description="Möchtest du dich wirklich abmelden?"
              onConfirm={onLogout}
              open={logoutConfirmOpen}
              setOpen={setLogoutConfirmOpen}
            >
              <SidebarMenuButton onClick={() => setLogoutConfirmOpen(true)}>
                <UserCircleIcon strokeWidth={2} />
                Logout
              </SidebarMenuButton>
            </ConfirmDialog>
          )}
          {!previlegedRole && (
            <SidebarMenuButton onClick={() => navigate("/login")}>
              <Login02Icon strokeWidth={2} />
              Login für Mannschaftsführer
            </SidebarMenuButton>
          )}
          {anyRole && (
            <SidebarMenuButton onClick={() => navigate("/benachrichtigungen")}>
              <Notification01Icon strokeWidth={2} />
              Benachrichtigungen
            </SidebarMenuButton>
          )}
          {admin && (
            <>
              <SidebarMenuButton onClick={() => navigate("/einstellungen")}>
                <Settings01Icon strokeWidth={2} />
                Konfiguration
              </SidebarMenuButton>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
