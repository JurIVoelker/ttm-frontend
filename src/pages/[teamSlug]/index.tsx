import CopyAllMatchInfo from "@/components/copy-all-match-info";
import Layout from "@/components/layout";
import MatchList from "@/components/match-list";
import PlayersCard from "@/components/players-card/players-card";
import Title from "@/components/title";
import useFetchMatchesByTeamSlug from "@/hooks/use-fetch/use-fetch-matches-by-team-slug";
import { useFetchPlayersByTeamSlug } from "@/hooks/use-fetch/use-fetch-players-by-team-slug";
import { queryClient } from "@/lib/query";
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
    if (!playerId || !matchesResponse.data) return;
    const updatedMatches = matchesResponse.data.map((m) => {
      if (m.id !== matchId) return m;
      const existingVote = m.matchAvailabilityVotes.find(
        (v) => v.playerId === playerId && v.matchId === matchId,
      );
      const updatedVotes = existingVote
        ? m.matchAvailabilityVotes.map((v) =>
            v.playerId === playerId && v.matchId === matchId
              ? { ...v, availability }
              : v,
          )
        : [...m.matchAvailabilityVotes, { playerId, matchId, availability }];
      return { ...m, matchAvailabilityVotes: updatedVotes };
    });
    queryClient.setQueryData(["fetch-matches-" + teamSlug], updatedMatches);
  };

  return (
    <Layout>
      <div>
        <Title className="animate-pop-in-subtle mb-6">{team?.name}</Title>
        <PlayersCard players={playerResponse?.data?.players || []} />
        <CopyAllMatchInfo
          matches={matchesResponse.data || []}
          players={playerResponse?.data?.players || []}
        />
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
