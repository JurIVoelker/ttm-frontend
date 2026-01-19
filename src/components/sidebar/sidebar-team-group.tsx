import { TeamDTO, TeamType } from "@/types/team";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { translateTeamType } from "@/constants/team";
import { ArrowDown01Icon } from "hugeicons-react";
import { mainStore } from "@/store/main-store";

type TeamGroupProps = {
  group: { type: TeamType; teams: TeamDTO[] };
  onClickTeam: (team: TeamDTO) => void;
};

export const getButtonStyles = (isCurrentTeam: boolean) => {
  const buttonStyles = buttonVariants({
    variant: isCurrentTeam ? "default" : "ghost",
  });
  const customButtonStyles = isCurrentTeam
    ? "hover:text-primary-foreground"
    : "bg-transparent text-primary hover:bg-sidebar-accent";

  return cn(buttonStyles, customButtonStyles, "justify-start");
};

export const SidebarTeamGroup = ({ group, onClickTeam }: TeamGroupProps) => {
  const teamSlug = mainStore((state) => state.teamSlug);
  if (group.teams.length === 0) return null;
  return (
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
                className={getButtonStyles(teamSlug === team.slug)}
                onClick={() => onClickTeam(team)}
              >
                {team.name}
              </Button>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};
