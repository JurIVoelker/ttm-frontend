import Layout from "@/components/layout";
import MatchList from "@/components/match-list";
import PlayersCard from "@/components/players-card/players-card";
import Title from "@/components/title";
import useFetchMatchesByTeamSlug from "@/hooks/use-fetch/use-fetch-matches-by-team-slug";
import { useFetchPlayersByTeamSlug } from "@/hooks/use-fetch/use-fetch-players-by-team-slug";
import { authStore } from "@/store/auth-store";
import { mainStore } from "@/store/main-store";
import { Availability } from "@/types/match";
import { useEffect } from "react";

const TeamPage = () => {
  const teamSlug = mainStore((state) => state.teamSlug);
  const teams = mainStore((state) => state.teams);
  const team = teams.find((t) => t.slug === teamSlug);

  const playerResponse = useFetchPlayersByTeamSlug();
  const matchesResponse = useFetchMatchesByTeamSlug();

  useEffect(() => {
    const fragment = window.location.hash;
    if (fragment) {
      const element = document.querySelector(fragment);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [matchesResponse.isPending, matchesResponse.data]);

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
      <div className="space-y-6">
        <Title className="animate-pop-in-subtle">{team?.name}</Title>
        <PlayersCard players={playerResponse?.data?.players || []} />
        <MatchList
          matches={matchesResponse.data || []}
          allPlayers={playerResponse?.data?.players || []}
          saveVote={onSaveVote}
        />
      </div>
    </Layout>
  );
};

export default TeamPage;
