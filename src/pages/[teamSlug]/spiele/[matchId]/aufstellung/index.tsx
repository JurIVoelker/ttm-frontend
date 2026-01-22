import Layout from "@/components/layout";
import LineupSelection from "@/components/lineup-selection";
import NavigationButtons from "@/components/navigation-buttons";
import Title from "@/components/title";
import { Badge } from "@/components/ui/badge";
import { useFetchData } from "@/hooks/fetch-data";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { mainStore } from "@/store/main-store";
import { SingleMatchDTO } from "@/types/match";
import { PlayersOfTeamDTO } from "@/types/player";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

const LineupPage = () => {
  const matchId = usePathname()?.split("/")?.[3];
  const teamSlug = mainStore((state) => state.teamSlug);

  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const match = useFetchData<SingleMatchDTO>({
    method: "GET",
    path: `/api/matches/${teamSlug}/${matchId}`,
    ready: Boolean(matchId && teamSlug),
  });

  const players = useFetchData<{ players: PlayersOfTeamDTO[] }>({
    method: "GET",
    path: `/api/players/${teamSlug}`,
    ready: Boolean(teamSlug),
  });

  const onSelectPlayer = (player: PlayersOfTeamDTO) => {
    const isSelected = match.data?.lineup?.some((lp) => lp.id === player.id);
    if (isSelected) {
      match.setData({
        ...match.data,
        lineup: match.data?.lineup.filter((lp) => lp.id !== player.id) || [],
      } as SingleMatchDTO);
    } else {
      match.setData({
        ...match.data,
        lineup: [...(match.data?.lineup || []), player],
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
      push(`/${teamSlug}`);
      setLoading(false);
      return;
    }

    showMessage("Fehler beim Speichern der Aufstellung.");
    setLoading(false);
  };

  return (
    <Layout>
      <Title className="mb-6">Aufstellung auswählen</Title>
      <div className="text-sm text-muted-foreground max-w-150 mb-4">
        Wähle die Spieler aus, wer bei diesem Spiel spielen soll. Anhand der
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
        oder kannst du sehen, ob die Spieler Zeit haben. Spieler mit der
        Plakette <Badge variant="outline">Unbekannt</Badge> haben noch nicht
        abgestimmt.
      </div>
      <NavigationButtons onSave={onSave} isSaving={loading} className="mt-2" />
      <LineupSelection
        match={match.data}
        players={players.data?.players}
        onSelectPlayer={onSelectPlayer}
      />
    </Layout>
  );
};

export default LineupPage;
