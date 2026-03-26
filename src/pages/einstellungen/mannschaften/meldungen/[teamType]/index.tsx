import AddPlayerDialog from "@/components/add-player-modal";
import ConfirmDialog from "@/components/confirm-dialog";
import Layout from "@/components/layout";
import NavigationButtons from "@/components/navigation-buttons";
import { Droppable } from "@/components/sort-players/droppable";
import { SortablePlayerItem } from "@/components/sort-players/sortable-item";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchPlayers } from "@/hooks/use-fetch/use-fetch-players";
import { useFetchSyncPlayers } from "@/hooks/use-fetch/use-fetch-sync-players";
import { useFetchTeamPositions } from "@/hooks/use-fetch/use-fetch-team-positions";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { PlayerGroup } from "@/lib/player.sort";
import { getTeamName } from "@/lib/team";
import { cn } from "@/lib/utils";
import { PlayerOfTeamDTO } from "@/types/player";
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
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PlayerPositionsPage = () => {
  const [teamCount, setTeamCount] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [openAutoImport, setOpenAutoImport] = useState(false);
  const { data, setData, isPending } = useFetchTeamPositions();
  const playerData = useFetchPlayers();
  const syncPlayersData = useFetchSyncPlayers();
  const pathName = usePathname();
  const { push } = useRouter();

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

  useEffect(() => {
    const fragment = window.location.hash;
    if (fragment) {
      const element = document.querySelector(fragment);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [pathName]);

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

  const targetTeamType =
    typeof window !== "undefined"
      ? (window.location.pathname.split("/").slice(-1)[0] as TeamType)
      : "";

  const targetPlayers = data?.teams.find(
    (team) => team.teamType === targetTeamType,
  )?.players;

  const syncPlayersForType =
    syncPlayersData.data?.find((t) => t.teamType === targetTeamType)?.players ?? [];
  const isAutoImportDisabled = syncPlayersForType.length === 0;

  const onAutoImport = () => {
    const existingPlayers = playerData.data?.players ?? [];
    const currentlyAssigned = targetPlayers ?? [];

    const newPlayers: PlayerOfTeamDTO[] = syncPlayersForType.map((syncPlayer) => {
      const existing = existingPlayers.find((p) => p.fullName === syncPlayer.name);
      const id = existing?.id ?? crypto.randomUUID();
      return {
        id,
        fullName: existing?.fullName ?? syncPlayer.name,
        position: {
          id: existing?.positions.find((pos) => pos.teamType === targetTeamType)?.id ?? crypto.randomUUID(),
          playerId: id,
          teamIndex: syncPlayer.teamIndex,
          position: syncPlayer.position,
          teamType: targetTeamType as TeamType,
        },
      };
    });

    const maxIndex = Math.max(...newPlayers.map((p) => p.position?.teamIndex ?? 0), 0);
    setTeamCount(maxIndex);
    setData({
      teams: [
        ...(data?.teams.filter((t) => t.teamType !== targetTeamType) ?? []),
        { teamType: targetTeamType as TeamType, players: newPlayers },
      ],
    });

    // Mirror onRemovePlayer: strip targetTeamType positions from previously assigned players
    let updatedPlayers = existingPlayers.map((p) =>
      currentlyAssigned.some((a) => a.id === p.id)
        ? { ...p, positions: p.positions.filter((pos) => pos.teamType !== targetTeamType) }
        : p,
    );

    // Mirror onAddPlayer: add/update the new position for each imported player
    for (const newPlayer of newPlayers) {
      const idx = updatedPlayers.findIndex((p) => p.id === newPlayer.id);
      if (idx >= 0) {
        updatedPlayers[idx] = {
          ...updatedPlayers[idx],
          positions: [
            ...updatedPlayers[idx].positions.filter((pos) => pos.teamType !== targetTeamType),
            newPlayer.position!,
          ],
        };
      } else {
        updatedPlayers = [...updatedPlayers, { id: newPlayer.id, fullName: newPlayer.fullName, positions: [newPlayer.position!] }];
      }
    }

    playerData.setData({ players: updatedPlayers });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    group.movePlayer({ activeId: active.id, overId: over?.id });
    setData(group.getStateValue(data?.teams || []));
  };

  const onRemovePlayer = (playerId: string) => {
    group.removePlayer(playerId);
    setData(group.getStateValue(data?.teams));
    const targetPlayer = playerData.data?.players.find(
      (player) => player.id === playerId,
    );
    if (!targetPlayer) {
      console.warn(
        `Player with id ${playerId} not found. Cannot remove from team.`,
      );
      return;
    }
    targetPlayer.positions = targetPlayer.positions.filter(
      (pos) => pos.teamType !== targetTeamType,
    );
    playerData.setData({
      players: [
        ...(playerData.data?.players.filter(
          (player) => player.id !== playerId,
        ) || []),
        targetPlayer,
      ],
    });
  };

  const onAddPlayer = (player: PlayerOfTeamDTO) => {
    if (!player.position) {
      console.warn("Player has no position. Cannot be added to team.");
      return;
    }
    if (!playerData.data) return;
    group.removePlayer(player.id);
    group.addPlayer(
      player,
      player.position.teamIndex,
      player.position.position,
    );

    const playerDTO = {
      id: player.id,
      fullName: player.fullName,
      positions: [player.position],
    };

    setData(group.getStateValue(data?.teams));
    playerData.setData({
      players: [
        ...playerData.data.players.filter((p) => p.id !== player.id),
        playerDTO,
      ],
    });
  };

  const onSave = async () => {
    setIsSaving(true);
    const response = await sendRequest({
      method: "PUT",
      path: "/api/players/types/positions/" + targetTeamType,
      body: {
        players: group.listDTOPlayers(),
      },
    });

    if (!response.ok) {
      showMessage("Fehler beim Speichern der Meldungen.", {
        variant: "error",
      });
      setIsSaving(false);
      return;
    }

    showMessage("Meldungen erfolgreich gespeichert.");
    push(`/einstellungen/mannschaften/meldungen`);
    setIsSaving(false);
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
      <div className="mt-6 flex">
        <Button
          variant="outline"
          disabled={isAutoImportDisabled}
          onClick={() => setOpenAutoImport(true)}
        >
          Automatisch importieren
        </Button>
      </div>
      <ConfirmDialog
        open={openAutoImport}
        setOpen={setOpenAutoImport}
        title="Automatisch importieren"
        description="Alle bestehenden Spieler werden entfernt und durch die Spieler aus dem Verband ersetzt. Danach Speichern nicht vergessen."
        onConfirm={onAutoImport}
      />
      <NavigationButtons
        onSave={onSave}
        isSaving={isSaving}
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
                    onAddPlayer={onAddPlayer}
                    teamIndex={index + 1}
                    teamPosition={team.players.length + 1}
                    allPlayers={playerData?.data?.players || []}
                    targetTeamType={targetTeamType}
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
                  onAddPlayer={onAddPlayer}
                  teamIndex={index + 1}
                  teamPosition={team.players.length + 1}
                  allPlayers={playerData?.data?.players || []}
                  targetTeamType={targetTeamType}
                />
              </div>
            );
          })}
          <Button
            className="mt-8 w-full"
            onClick={() =>
              setTeamCount((prev) =>
                Math.max(prev + 1, groupedTeams.length + 1),
              )
            }
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
