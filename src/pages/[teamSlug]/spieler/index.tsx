import Layout from "@/components/layout";
import NavigationButtons from "@/components/navigation-buttons";
import Title from "@/components/title";
import { useFetchData } from "@/hooks/fetch-data";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { groupPlayersToOtherTeams } from "@/lib/team";
import { cn } from "@/lib/utils";
import { mainStore } from "@/store/main-store";
import { PlayersOfTeamDTO } from "@/types/player";
import { TeamPositionsDTO } from "@/types/team";
import { Tick01Icon } from "hugeicons-react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ManagePlayersPage = () => {
  const teamSlug = mainStore((state) => state.teamSlug);
  const teams = mainStore((state) => state.teams);

  const playerResponse = useFetchData<{ players: PlayersOfTeamDTO[] }>({
    method: "GET",
    path: `/api/players/${teamSlug}`,
    ready: Boolean(teamSlug),
  });

  const teamPositionsResponse = useFetchData<{ teams: TeamPositionsDTO[] }>({
    method: "GET",
    path: `/api/teams/types/positions`,
  });

  const [selectedPlayers, setSelectedPlayers] = useState<PlayersOfTeamDTO[]>(
    [],
  );

  const { push } = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (playerResponse.data) {
      setSelectedPlayers(playerResponse.data.players);
    }
  }, [playerResponse.data]);

  const loading = playerResponse.loading || teamPositionsResponse.loading;
  const dataReceived =
    !loading &&
    playerResponse.data !== null &&
    teamPositionsResponse.data !== null;

  const currentTeam = teams.find((t) => t.slug === teamSlug);
  const targetTeamType = teamPositionsResponse?.data?.teams?.find(
    (t) => t?.teamType === currentTeam?.type,
  );

  const targetTeamPositions = targetTeamType?.players.filter(
    (p) => p.position && p.position.teamIndex === currentTeam?.groupIndex,
  );

  const otherTeams = groupPlayersToOtherTeams({
    currentTeam,
    allPositions: teamPositionsResponse?.data?.teams || [],
    teams: teams || [],
  });

  const onSaveSelection = async () => {
    setIsSaving(true);

    const response = await sendRequest({
      path: `/api/team/${teamSlug}/players`,
      method: "POST",
      body: { playerIds: selectedPlayers.map((p) => p.id) },
    });

    if (response.ok) {
      showMessage("Spielerauswahl gespeichert");
      push(`/${teamSlug}`);
    } else {
      showMessage("Fehler beim Speichern der Auswahl", { variant: "error" });
    }
    setIsSaving(false);
  };

  return (
    <Layout>
      {loading ? (
        <LoadingState />
      ) : dataReceived ? (
        <div className="pb-16">
          <Title>Spieler</Title>
          <p className="pt-4 text-sm max-w-150 text-muted-foreground">
            Die folgenden Listen zeigen die Spieler die in den jeweiligen
            Mannschaften gemeldet sind. Wähle die Spieler aus, die in deiner
            Mannschaft spielen sollen.
          </p>
          <NavigationButtons onSave={onSaveSelection} isSaving={isSaving} />
          <div className="space-y-4 md:mt-6">
            <TeamPositionsCard
              players={targetTeamPositions}
              selectedPlayers={selectedPlayers}
              title="Vorgeschlagene Spieler"
              setSelectedPlayers={setSelectedPlayers}
              variant="highlighted"
              className="mt-1"
            />
            {otherTeams.map((otp) => (
              <TeamPositionsCard
                players={otp.players}
                selectedPlayers={selectedPlayers}
                title={otp.teamName}
                setSelectedPlayers={setSelectedPlayers}
                key={otp.index}
              />
            ))}
          </div>
        </div>
      ) : (
        <>Fehler beim Laden</>
      )}
    </Layout>
  );
};

const TeamPositionsCard = ({
  players,
  title,
  selectedPlayers,
  setSelectedPlayers,
  variant = "default",
  className,
  ...props
}: {
  variant?: "default" | "highlighted";
  players?: PlayersOfTeamDTO[];
  title?: string;
  className?: string;
  selectedPlayers: PlayersOfTeamDTO[];
  setSelectedPlayers: Dispatch<SetStateAction<PlayersOfTeamDTO[]>>;
}) => {
  if (!players || players.length === 0) return <></>;

  return (
    <div
      className={cn(
        "border rounded-sm p-3 bg-secondary/30",
        variant === "highlighted" && "pulse-border",
        className,
      )}
      {...props}
    >
      <h2
        className={cn(
          "font-semibold text-base",
          variant !== "highlighted" && "text-muted-foreground font-normal",
        )}
      >
        {title}
      </h2>
      {variant === "highlighted" && (
        <p className="text-sm text-muted-foreground mb-3">
          Diese Spieler sind in deiner Mannschaft gemeldet.{" "}
        </p>
      )}
      <div className="text-sm space-y-1.5 mt-2">
        {players?.map((p) => {
          const isSelected = selectedPlayers?.some((sp) => sp.id === p.id);

          return (
            <button
              key={p.id}
              className={cn(
                "rounded-md w-full py-1.5 px-1.5 bg-background text-left border flex gap-1.5 items-center",
                isSelected &&
                  "bg-primary text-primary-foreground border-primary",
              )}
              onClick={() => {
                setSelectedPlayers((prev: PlayersOfTeamDTO[]) => {
                  if (isSelected) {
                    return prev.filter((sp) => sp.id !== p.id);
                  } else {
                    return [...prev, p];
                  }
                });
              }}
            >
              <Tick01Icon
                className={cn(
                  "shrink-0 size-5 animate-pop-in",
                  !isSelected && "hidden",
                )}
                strokeWidth={2}
              />
              <PlusIcon
                className={cn(
                  "shrink-0 size-5 animate-fade-in-rotate",
                  isSelected && "hidden",
                )}
                strokeWidth={2}
              />
              {p.fullName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const LoadingState = () => {
  return <></>;
};

export default ManagePlayersPage;
