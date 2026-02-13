import AddPlayerDialog from "@/components/add-player-modal";
import Layout from "@/components/layout";
import NavigationButtons from "@/components/navigation-buttons";
import { Droppable } from "@/components/sort-players/droppable";
import { SortablePlayerItem } from "@/components/sort-players/sortable-item";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTeamPositions } from "@/hooks/use-fetch/use-fetch-team-positions";
import { PlayerGroup } from "@/lib/player.sort";
import { getTeamName } from "@/lib/team";
import { cn } from "@/lib/utils";
import { TeamType } from "@/types/team";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DragDropVerticalIcon, PlusSignIcon } from "hugeicons-react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const PlayerPositionsPage = () => {
  const { data, setData, isPending } = useFetchTeamPositions();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.05,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [teamCount, setTeamCount] = useState(0);

  const targetTeamType =
    typeof window !== "undefined"
      ? (window.location.pathname.split("/").slice(-1)[0] as TeamType)
      : "";

  useEffect(() => {
    if (!isPending && data) {
      const indicies = data.teams
        .find((team) => team.teamType === targetTeamType)
        ?.players.flatMap((player) => player.position?.teamIndex)
        .filter((index) => index !== undefined);
      const maxIndex = indicies ? Math.max(...indicies) : 0;
      setTeamCount(maxIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  const targetPlayers = data?.teams.find(
    (team) => team.teamType === targetTeamType,
  )?.players;

  const onDragOver = (event: DragOverEvent) => {
    console.log("onDragOver");
    const { active, over } = event;
    group.movePlayer({ activeId: active.id, overId: over?.id });
    setData(group.getStateValue(data?.teams || []));
  };

  const onRemovePlayer = (playerId: string) => {
    group.removePlayer(playerId);
    setData(group.getStateValue(data?.teams));
  };

  const group = new PlayerGroup({
    players: targetPlayers || [],
    type: targetTeamType as TeamType,
    minLength: teamCount,
  });
  const groupedTeams = group.group;

  return (
    <Layout>
      <Title>Mannschaften & Meldungen</Title>
      <p className="mt-8 text-muted-foreground">
        Erstelle/entferne Mannschaften und verwalte die Mannschaftsmeldungen für
        die jeweiligen Mannschaften.
      </p>
      <NavigationButtons
        onSave={() => {}}
        isSaving={false}
        backNavigation="/einstellungen/mannschaften/meldungen"
      />
      {isPending && <LoadingState />}
      <DndContext
        onDragStart={(event) => setActiveId(String(event.active.id))}
        onDragEnd={() => setActiveId(null)}
        onDragCancel={() => setActiveId(null)}
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragOver={onDragOver}
        autoScroll={false}
      >
        <SortableContext
          items={targetPlayers?.map((player) => player.id) || []}
          key={1}
          strategy={verticalListSortingStrategy}
        >
          {groupedTeams.map((team, index) => {
            if (targetTeamType === "") return null;
            if (team.players.length === 0)
              return (
                <div
                  className="space-y-2 mt-6 border p-5 rounded-lg"
                  key={index}
                >
                  <p className="font-medium mb-6">
                    {getTeamName(targetTeamType, index + 1)}
                  </p>

                  <Droppable
                    id={`team-${index + 1}`}
                    className="p-2 border rounded-lg mt-4 text-muted-foreground flex items-center gap-1 bg-card"
                  >
                    <PlusSignIcon strokeWidth={2} className="size-5" />
                    Noch keine Spieler
                  </Droppable>

                  <AddPlayerDialog
                    onAddPlayer={() => {}}
                    teamGroups={data?.teams}
                  />
                </div>
              );
            return (
              <div className="space-y-2 mt-6 border p-5 rounded-lg" key={index}>
                <h3 className="mb-4 font-medium">{team.teamName}</h3>
                <div className="space-y-1.5">
                  {team.players.map((player, playerIndex) => (
                    <div
                      key={player.id}
                      className={cn("flex items-center w-full gap-2")}
                    >
                      <div
                        className={cn(
                          "bg-secondary text-secondary-foreground size-6 flex items-center justify-center rounded-md font-semibold shrink-0 mr-2",
                          activeId === player.id &&
                            "bg-primary text-primary-foreground",
                        )}
                      >
                        {playerIndex + 1}
                      </div>
                      <SortablePlayerItem id={player.id}>
                        <div
                          className={cn(
                            "px-2 py-1.5 bg-secondary/40 active:bg-secondary hover:cursor-grab active:cursor-grabbing transition-colors rounded-md border w-full flex items-center gap-1.5",
                            activeId === player.id && "opacity-20",
                          )}
                        >
                          <DragDropVerticalIcon className="shrink-0" />
                          {player.fullName}
                        </div>
                      </SortablePlayerItem>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="shrink-0"
                        onClick={() => onRemovePlayer(player.id)}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ))}
                </div>
                <AddPlayerDialog
                  onAddPlayer={() => {}}
                  teamGroups={data?.teams}
                />
              </div>
            );
          })}
          <Button
            className="mt-8 w-full"
            onClick={() => setTeamCount((prev) => prev + 1)}
          >
            <PlusSignIcon strokeWidth={2} />
            Neue Mannschaft
          </Button>
          <DragOverlay className="border rounded-sm flex items-center p-2 gap-1.5 bg-secondary">
            <DragDropVerticalIcon className="shrink-0" />
            {
              group.listPlayers().find((player) => player.id === activeId)
                ?.fullName
            }
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </Layout>
  );
};

const LoadingState = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-60 rounded-md mb-6" />
      ))}
      <Skeleton className="w-full h-10 rounded-md mt-8" />
    </>
  );
};

export default PlayerPositionsPage;
