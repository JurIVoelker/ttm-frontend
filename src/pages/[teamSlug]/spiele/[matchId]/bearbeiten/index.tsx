import EditMatchForm from "@/components/edit-match-form";
import Layout from "@/components/layout";
import Title from "@/components/title";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/fetch-data";
import { mainStore } from "@/store/main-store";
import { SingleMatchDTO } from "@/types/match";
import { usePathname } from "next/navigation";

const EditMatchPage = () => {
  const teamSlug = mainStore((state) => state.teamSlug);
  const matchId = usePathname()?.split("/")?.[3];

  const { data, loading } = useFetchData<SingleMatchDTO>({
    method: "GET",
    path: `/api/matches/${teamSlug}/${matchId}`,
    ready: Boolean(teamSlug && matchId),
  });

  return (
    <Layout>
      <Title className="mb-6">
        Spiel gegen {data?.enemyName || "unbekannt"} bearbeiten
      </Title>
      {!loading && data && <EditMatchForm match={data} />}
      {loading && <LoadingState />}
    </Layout>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-4 z-1">
      <Skeleton className="h-50 w-full" />
      <Skeleton className="h-74 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

export default EditMatchPage;
