import Layout from "@/components/layout";
import Title from "@/components/title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/use-fetch-data";
import { getTeamName } from "@/lib/team";
import { mainStore } from "@/store/main-store";
import { LeaderDTO } from "@/types/leader";
import { TeamPositionsDTO } from "@/types/team";
import { ArrowReloadHorizontalIcon, PlusSignIcon } from "hugeicons-react";
import { useRouter } from "next/router";

const Mannschaften = () => {
  const { data, loading } = useFetchData<{
    teams: TeamPositionsDTO[];
  }>({
    method: "GET",
    path: "/api/teams/types/positions",
  });

  const leaderFetch = useFetchData<LeaderDTO[]>({
    method: "GET",
    path: "/api/leaders",
  });

  const { push } = useRouter();

  if (loading || leaderFetch.loading) return <LoadingState />;

  return (
    <Layout>
      <Title className="animate-pop-in-subtle">Mannschaften</Title>
      <div className="flex flex-col mt-8 gap-2 animate-pop-in-subtle">
        <Button variant="outline">
          <ArrowReloadHorizontalIcon strokeWidth={2} /> Importieren
        </Button>
        <Button variant="outline" onClick={() => push("/mannschaften/neu")}>
          <PlusSignIcon strokeWidth={2} /> Neue Mannschaft
        </Button>
      </div>

      <div className="mt-6">
        {data?.teams?.map((teamTypeGroup) => {
          const maxIndex = teamTypeGroup.players.reduce(
            (max, player) =>
              !player.position || max > player.position?.teamIndex
                ? max
                : player.position?.teamIndex,
            0,
          );

          const indexArray = Array.from({ length: maxIndex }, (_, i) =>
            teamTypeGroup.players.filter(
              (player) => player.position?.teamIndex === i + 1,
            ),
          );

          return (
            <div
              key={teamTypeGroup.teamType}
              className="space-y-4 md:grid md:grid-cols-2 gap-4 lg:grid-cols-3 md:space-y-0"
            >
              {indexArray.map((players, index) => {
                const leaders = leaderFetch.data?.filter((leader) =>
                  leader.team.some(
                    (team) =>
                      team.type === teamTypeGroup.teamType &&
                      team.groupIndex === index + 1,
                  ),
                );

                const team = mainStore
                  .getState()
                  .teams?.find(
                    (t) =>
                      t.type === teamTypeGroup.teamType &&
                      t.groupIndex === index + 1,
                  );

                return (
                  <Card key={index} className="gap-3 animate-pop-in-subtle">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {getTeamName(teamTypeGroup.teamType, index + 1)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="mb-1.5">Mannschaftsführer</h3>
                      {leaders !== undefined &&
                        leaders.length > 0 &&
                        leaders.map((leader) => (
                          <Badge
                            key={leader.id}
                            variant="outline"
                            className="bg-secondary/70"
                          >
                            {leader.fullName}
                          </Badge>
                        ))}
                      {!leaders ||
                        (leaders.length === 0 && (
                          <div className="text-sm text-muted-foreground">
                            Es sind noch keine Mannschaftsführer für diese
                            Mannschaft eingetragen.
                          </div>
                        ))}
                      <h3 className="mb-1.5 mt-5">Meldungen</h3>
                      <div className="text-sm text-muted-foreground">
                        {players.map((player, index) => (
                          <span
                            key={player.id}
                            className="mr-2 inline-flex items-center gap-1"
                          >
                            <div className="size-4 bg-primary rounded-sm flex items-center justify-center text-xs font-mono text-primary-foreground font-semibold">
                              {player.position?.position}
                            </div>
                            {player.fullName}
                            {index < players.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="mt-2 w-full"
                        onClick={() => push(`/mannschaften/${team?.slug}`)}
                      >
                        Bearbeiten
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

const LoadingState = () => (
  <Layout>
    <Skeleton className="h-8 w-full mb-2" />
    <Separator />
    <Skeleton className="h-9 w-full mb-2 mt-8" />
    <Skeleton className="h-9 w-full mb-2 mt-2" />
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 mt-6 md:space-y-0">
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  </Layout>
);

export default Mannschaften;
