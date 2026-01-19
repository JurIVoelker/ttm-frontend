import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar";
import { useFetchData } from "@/hooks/fetch-data";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Collapsible } from "./ui/collapsible";
import { Skeleton } from "./ui/skeleton";
import { TeamDTO, TeamType } from "@/types/team";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Button, buttonVariants } from "./ui/button";
import { ArrowDown01Icon } from "hugeicons-react";
import { TEAM_TYPES, translateTeamType } from "@/constants/team";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { mainStore } from "@/store/main-store";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
});

const getButtonStyles = (isCurrentTeam: boolean) => {
  const buttonStyles = buttonVariants({
    variant: isCurrentTeam ? "default" : "ghost",
  });
  const customButtonStyles = isCurrentTeam
    ? "hover:text-primary-foreground"
    : "bg-transparent text-primary hover:bg-sidebar-accent";

  return cn(buttonStyles, customButtonStyles, "justify-start");
};

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const teamsResponse = useFetchData<{ teams: TeamDTO[] }>({
    method: "GET",
    path: `/api/teams`,
  });

  const isMobile = useIsMobile();
  const { push } = useRouter();

  useEffect(() => {
    mainStore.getState().setTeams(teamsResponse.data?.teams || []);
  }, [teamsResponse.data]);

  const noPlayers =
    teamsResponse.data?.teams.length === 0 && !teamsResponse.loading;

  const onClickTeam = (team: TeamDTO) => {
    if (isMobile) {
      toggleSidebar();
    }
    push(`/${team.slug}`);
  };

  const getTeamsByType = (type: TeamType) => {
    return teamsResponse.data?.teams.filter((team) => team.type === type) || [];
  };

  const groupedTeams: { type: TeamType; teams: TeamDTO[] }[] = TEAM_TYPES.map(
    (t) => ({ type: t, teams: getTeamsByType(t) }),
  );

  return (
    <Sidebar>
      <SidebarContent className={cn("pt-20", poppins.className)}>
        <SidebarGroup>
          <SidebarGroupLabel>Alle Mannschaften</SidebarGroupLabel>
          <SidebarMenu>
            {teamsResponse.loading && <Skeleton className="h-10 w-full" />}
            {noPlayers && (
              <p className="text-sm text-muted-foreground">
                Keine Mannschaften gefunden.
              </p>
            )}
            {groupedTeams.map((group) => (
              <Fragment key={group.type}>
                {group.teams.length > 0 && (
                  <>
                    <Collapsible defaultOpen>
                      <CollapsibleTrigger asChild key={group.type}>
                        <SidebarMenuButton
                          className={cn(
                            buttonVariants({
                              variant: "secondary",
                            }),
                            "justify-start",
                            "flex justify-between items-center",
                          )}
                        >
                          {translateTeamType(group.type)}
                          <ArrowDown01Icon strokeWidth={2} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.teams.map((team) => (
                            <SidebarMenuSubItem key={team.slug}>
                              <Button
                                className={getButtonStyles(false)}
                                onClick={() => onClickTeam(team)}
                              >
                                {team.name}
                              </Button>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
