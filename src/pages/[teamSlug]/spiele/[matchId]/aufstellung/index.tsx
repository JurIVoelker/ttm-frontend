import Layout from "@/components/layout";
import LineupSelection from "@/components/lineup-selection";
import NavigationButtons from "@/components/navigation-buttons";
import ReplacementPlayerDrawer from "@/components/replacement-player-drawer";
import Title from "@/components/title";
import { Badge } from "@/components/ui/badge";
import useFetchMatchById from "@/hooks/use-fetch/use-fetch-match-by-id";
import { useFetchPlayersByTeamSlug } from "@/hooks/use-fetch/use-fetch-players-by-team-slug";
import { useFetchTeamPositions } from "@/hooks/use-fetch/use-fetch-team-positions";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { groupPlayersToOtherTeams } from "@/lib/team";
import { mainStore } from "@/store/main-store";
import { SingleMatchDTO } from "@/types/match";
import { PlayerOfTeamDTO } from "@/types/player";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

const LineupPage = () => {
  const matchId = usePathname()?.split("/")?.[3];
  const teamSlug = mainStore((state) => state.teamSlug);
  const teams = mainStore((state) => state.teams);

  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const match = useFetchMatchById({ matchId });
  const players = useFetchPlayersByTeamSlug();
  const teamPositions = useFetchTeamPositions();

  const lineup = match.data?.lineup || [];

  const otherTeams = groupPlayersToOtherTeams({
    currentTeam: teams.find((t) => t.slug === teamSlug),
    allPositions: teamPositions.data?.teams || [],
    teams: teams || [],
  });

  const onSelectPlayerReplacementPlayers = (
    selectedPlayers: PlayerOfTeamDTO[],
  ) => {
    match.setData({
      ...match.data,
      lineup: [...(lineup || []), ...selectedPlayers],
    } as SingleMatchDTO);
  };

  const onRemovePlayer = (player: PlayerOfTeamDTO) => {
    match.setData({
      ...match.data,
      lineup: lineup?.filter((lp) => lp.id !== player.id) || [],
    } as SingleMatchDTO);
  };

  const onSelectPlayer = (player: PlayerOfTeamDTO) => {
    const isSelected = lineup?.some((lp) => lp.id === player.id);
    if (isSelected) {
      onRemovePlayer(player);
    } else {
      match.setData({
        ...match.data,
        lineup: [...(lineup || []), player],
      } as SingleMatchDTO);
    }
  };

  const onSave = async () => {
    setLoading(true);
    const res = await sendRequest({
      path: `/api/match/${teamSlug}/lineup/${matchId}`,
      method: "POST",
      body: { playerIds: match.data?.lineup.map((p) => p.id) || [] },
    });

    if (res.ok) {
      showMessage("Die Aufstellung wurde erfolgreich gespeichert.");
      push(`/${teamSlug}#match-card-${matchId}`);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Title className="mb-6">Aufstellung auswählen</Title>
      <div className="text-sm text-muted-foreground max-w-150 mb-4">
        Wähle die Spieler aus, die bei diesem Spiel spielen sollen. Anhand der
        Plaketten{" "}
        <Badge variant="positive" className="translate-y-0.5">
          Hat Zeit
        </Badge>
        {", "}
        <Badge variant="negative" className="translate-y-0.5">
          Keine Zeit
        </Badge>
        {", "}
        <Badge variant="neutral" className="translate-y-0.5">
          Vielleicht
        </Badge>{" "}
        oder kannst du sehen, ob sie Zeit haben. Spieler mit der Plakette{" "}
        <Badge variant="outline">Unbekannt</Badge> haben noch nicht abgestimmt.
      </div>
      <NavigationButtons
        onSave={onSave}
        isSaving={loading || match.isPending}
        className="mt-2"
        backNavigation={`/${teamSlug}#match-card-${matchId}`}
      />
      <LineupSelection
        match={match.data}
        players={players.data?.players}
        onSelectPlayer={onSelectPlayer}
        onRemovePlayer={onRemovePlayer}
      />
      <ReplacementPlayerDrawer
        selectedPlayers={lineup}
        teams={otherTeams}
        onSelectPlayers={onSelectPlayerReplacementPlayers}
        className="mt-6"
      />
    </Layout>
  );
};

export default LineupPage;
