import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useFetchData } from "@/hooks/use-fetch-data";
import { cn } from "@/lib/utils";
import { mainStore } from "@/store/main-store";
import { LeaderDTO } from "@/types/leader";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlusSignIcon,
} from "hugeicons-react";
import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

const LeaderPage = () => {
  const teams = mainStore((state) => state.teams);
  const leaderFetch = useFetchData<LeaderDTO[]>({
    method: "GET",
    path: "/api/leaders",
  });
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const { back } = useRouter();

  return (
    <Layout>
      <Title>Mannschaftsführer</Title>
      <p className="mt-8 text-muted-foreground">
        Wähle die Mannschaftsführer für die jeweiligen Mannschaften aus.
      </p>
      <div>
        <Button variant="outline" onClick={back} className="mt-4">
          <ArrowLeft01Icon strokeWidth={2} /> Zurück
        </Button>
      </div>
      <div className="space-y-2 mt-8">
        {teams.map((team) => (
          <Collapsible
            key={team.slug}
            open={openCollapsible === team.slug}
            onOpenChange={(open) => setOpenCollapsible(open ? team.slug : null)}
          >
            <CollapsibleTrigger asChild>
              <div
                className={cn(
                  "w-full flex justify-between items-center bg-secondary/60 p-2 px-3",
                  openCollapsible === team.slug ? "rounded-t-lg" : "rounded-lg",
                )}
              >
                {team.name}
                <Button variant="outline" size="icon">
                  <ArrowRight01Icon
                    strokeWidth={2}
                    className={cn("transition-transform ", {
                      "rotate-90": openCollapsible === team.slug,
                    })}
                  />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-secondary/60 rounded-b-lg">
              <Separator />
              <div className="space-y-4 p-3">
                {leaderFetch.data
                  ?.filter((leader) =>
                    leader.team.some((t) => t.slug === team.slug),
                  )
                  .map((leader) => (
                    <div
                      key={leader.id}
                      className="w-full flex justify-between items-center"
                    >
                      {leader.fullName}
                      <Button variant="destructive" size="icon-sm">
                        <X />
                      </Button>
                    </div>
                  ))}
                <Button className="w-full" variant="outline">
                  <PlusSignIcon strokeWidth={2} />
                  Hinzufügen
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Layout>
  );
};

export default LeaderPage;
