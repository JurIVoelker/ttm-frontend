import AddLeaderModal from "@/components/add-leader-modal";
import ConfirmDialog from "@/components/confirm-dialog";
import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import useFetchLeaders from "@/hooks/use-fetch/use-fetch-leaders";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { cn } from "@/lib/utils";
import { mainStore } from "@/store/main-store";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
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
  const leaderFetch = useFetchLeaders();
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const { back } = useRouter();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<null | string>(
    null,
  );

  const onAddLeader = () => {
    leaderFetch.refetch();
  };

  const onRemoveLeader = async (leaderId: string, teamSlug: string) => {
    const prevState = leaderFetch.data;
    const newLeaderData = leaderFetch.data?.filter(
      (leader) => leader.id !== leaderId,
    );
    leaderFetch.setData(newLeaderData || []);

    const res = await sendRequest({
      path: `/api/leader/${teamSlug}`,
      method: "DELETE",
      body: {
        id: leaderId,
      },
    });

    if (!res.ok) {
      showMessage("Fehler beim Entfernen des Mannschaftsführers", {
        variant: "error",
      });
      leaderFetch.setData(prevState || []);
      return;
    }
  };

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
                      <ConfirmDialog
                        title="Löschen"
                        description="Möchstest du den Mannschaftsführer wirklich löschen?"
                        onConfirm={() => onRemoveLeader(leader.id, team.slug)}
                        open={openConfirmDialog === leader.id}
                        setOpen={(open) =>
                          setOpenConfirmDialog(open ? leader.id : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon-sm">
                            <X />
                          </Button>
                        </AlertDialogTrigger>
                      </ConfirmDialog>
                    </div>
                  ))}
                <AddLeaderModal onAdd={onAddLeader} teamSlug={team.slug}>
                  <Button className="w-full" variant="outline">
                    <PlusSignIcon strokeWidth={2} />
                    Hinzufügen
                  </Button>
                </AddLeaderModal>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Layout>
  );
};

export default LeaderPage;
