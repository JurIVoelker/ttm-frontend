import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchTeamPositions } from "@/hooks/use-fetch/use-fetch-team-positions";
import { translateTeamType } from "@/lib/team";
import { mainStore } from "@/store/main-store";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import { useRouter } from "next/router";

const PlayerPositionsPage = () => {
  const teams = mainStore((state) => state.teams);
  const { data } = useFetchTeamPositions();
  const { push } = useRouter();

  return (
    <Layout>
      <Title>Mannschaften & Meldungen</Title>
      <p className="mt-8 text-muted-foreground">
        Für welchen Mannschaftstyp möchtest du die Meldungen verwalten?
      </p>
      <Button
        variant="outline"
        onClick={() => push("/einstellungen")}
        className="mt-4"
      >
        <ArrowLeft01Icon strokeWidth={2} /> Zurück
      </Button>
      <div className="flex flex-col gap-4 mt-8 md:grid md:grid-cols-2">
        {data?.teams.map((teamGroup) => (
          <Card
            className="hover:bg-secondary/80 transition-colors cursor-pointer"
            key={teamGroup.teamType}
            onClick={() =>
              push(
                `/einstellungen/mannschaften/meldungen/${teamGroup.teamType}`,
              )
            }
          >
            <CardHeader className="flex gap-2 justify-between items-center">
              <div className="space-y-2">
                <CardTitle>{translateTeamType(teamGroup.teamType)}</CardTitle>
                <CardDescription>
                  (
                  {
                    teams.filter((team) => team.type === teamGroup.teamType)
                      .length
                  }{" "}
                  Mannschaften)
                </CardDescription>
              </div>
              <ArrowRight01Icon strokeWidth={2} />
            </CardHeader>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default PlayerPositionsPage;
