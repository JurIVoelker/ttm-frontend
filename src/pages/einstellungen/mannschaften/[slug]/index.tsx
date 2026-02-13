import Layout from "@/components/layout";
import NavigationButtons from "@/components/navigation-buttons";
import { SortablePlayerItem } from "@/components/sort-players/sortable-item";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import useFetchLeaders from "@/hooks/use-fetch/use-fetch-leaders";
import { useFetchTeamPositions } from "@/hooks/use-fetch/use-fetch-team-positions";
import { mainStore } from "@/store/main-store";
import { TeamDTO, TeamPositionsDTO } from "@/types/team";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DragDropVerticalIcon } from "hugeicons-react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const EditTeamPage = () => {
  const [team, setTeam] = useState<TeamDTO | null>(null);
  useEffect(() => {
    const slug = window.location.pathname.split("/").slice(-1)[0];
    const team = mainStore.getState().teams.find((team) => team.slug === slug);
    if (!team) return;
    setTeam(team);
  }, []);

  const { data, setData } = useFetchTeamPositions();

  const leaderFetch = useFetchLeaders();

  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const playersOfType =
    data?.teams.find((t) => t.teamType === team?.type)?.players || [];

  const playersOfTeam = playersOfType.filter(
    (playersOfTeam) => playersOfTeam.position?.teamIndex === team?.groupIndex,
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const invalidEvent = !active.id || !over?.id || active.id === over?.id;
    if (invalidEvent || !team) return;

    const playersOfOtherTeams = playersOfType.filter(
      (playersOfTeam) => playersOfTeam.position?.teamIndex !== team.groupIndex,
    );

    const oldIndex = playersOfTeam.findIndex((item) => item.id === active.id);
    const newIndex = playersOfTeam.findIndex((item) => item.id === over?.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(playersOfTeam, oldIndex, newIndex).reduce(
      (acc, player, index) => {
        if (!player.position) return acc;
        acc.push({
          ...player,
          position: {
            ...player.position,
            position: index + 1,
          },
        });
        return acc;
      },
      [] as typeof playersOfTeam,
    );

    const newData: TeamPositionsDTO[] = [
      ...(data?.teams.filter((t) => t.teamType !== team.type) ?? []),
      {
        teamType: team.type,
        players: [...playersOfOtherTeams, ...newOrder],
      },
    ];
    setData({ teams: newData });
  }

  async function handleSave() {
    if (!team) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  }

  return (
    <Layout>
      <Title>{team?.name || "Mannschaft"} bearbeiten</Title>
      <p className="text-muted-foreground mt-4">
        Auf dieser Seite kannst du die Meldungen der Mannschaft bearbeiten.
      </p>
      <NavigationButtons
        onSave={handleSave}
        isSaving={isSaving}
        backNavigation="/mannschaften"
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        autoScroll={false}
      >
        <SortableContext items={playersOfTeam || []}>
          <div className="space-y-2 mt-6 overflow-hidden">
            {playersOfTeam?.map((player, index) => (
              <div key={player.id} className="flex items-center w-full gap-2">
                <div className="bg-primary text-primary-foreground size-7 flex items-center justify-center rounded-md font-semibold shrink-0 mr-2">
                  {index + 1}
                </div>
                <SortablePlayerItem id={player.id}>
                  <div className="p-2 bg-secondary/40 active:bg-secondary hover:cursor-grab active:cursor-grabbing transition-colors rounded-md border w-full flex items-center gap-1.5">
                    <DragDropVerticalIcon className="shrink-0" />
                    {player.fullName}
                  </div>
                </SortablePlayerItem>
                <Button variant="destructive" size="icon" className="shrink-0">
                  <XIcon />
                </Button>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Layout>
  );
};

export default EditTeamPage;
