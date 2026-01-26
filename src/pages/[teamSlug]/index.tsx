import Layout from "@/components/layout";
import MatchList from "@/components/match-list";
import PlayersCard from "@/components/players-card/players-card";
import Title from "@/components/title";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/fetch-data";
import { authStore } from "@/store/auth-store";
import { mainStore } from "@/store/main-store";
import { Availability, MatchesDTO } from "@/types/match";
import { PlayersOfTeamDTO } from "@/types/player";
import { useEffect } from "react";

const TeamPage = () => {
  const teamSlug = mainStore((state) => state.teamSlug);
  const teams = mainStore((state) => state.teams);
  const team = teams.find((t) => t.slug === teamSlug);

  const playerResponse = useFetchData<{ players: PlayersOfTeamDTO[] }>({
    method: "GET",
    path: `/api/players/${teamSlug}`,
    ready: Boolean(teamSlug),
  });

  const matchesResponse = useFetchData<MatchesDTO>({
    method: "GET",
    path: `/api/matches/${teamSlug}`,
    ready: Boolean(teamSlug),
  });

  useEffect(() => {
    const fragment = window.location.hash;
    if (fragment) {
      const element = document.querySelector(fragment);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [matchesResponse.loading]);

  const onSaveVote = async (availability: Availability, matchId: string) => {
    const playerId = authStore.getState().jwtDecoded?.player?.id;
    if (!playerId) return;
    const targetMatch = matchesResponse?.data?.find((m) => m.id === matchId);
    if (!targetMatch) return;
    const targetVote = targetMatch.matchAvailabilityVotes.find(
      (v) => v.playerId === playerId && v.matchId === matchId,
    );
    if (targetVote) {
      targetVote.availability = availability;
    } else {
      targetMatch.matchAvailabilityVotes.push({
        playerId,
        matchId,
        availability,
      });
    }
    matchesResponse.setData(matchesResponse.data!);
  };

  return (
    <Layout>
      {playerResponse.loading ? (
        <LoadingState />
      ) : playerResponse.data !== null && !playerResponse.loading ? (
        <div className="space-y-6">
          <Title>{team?.name}</Title>
          <PlayersCard players={playerResponse.data.players} />
          <MatchList
            matches={matchesResponse.data || []}
            allPlayers={playerResponse?.data?.players || []}
            saveVote={onSaveVote}
          />
        </div>
      ) : (
        <>Nicht gefunden</>
      )}
    </Layout>
  );
};

const LoadingState = () => {
  return (
    <>
      <Skeleton className="w-full h-8" />
      <Separator className="mt-2 w-full" />
      <Skeleton className="w-full h-56 mt-6" />
    </>
  );
};

export default TeamPage;
