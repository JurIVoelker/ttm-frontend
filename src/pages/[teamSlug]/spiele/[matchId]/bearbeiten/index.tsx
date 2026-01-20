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

  console.log({ data });

  return (
    <Layout>
      <Title className="mb-6">Spiel gegen {data?.enemyName} bearbeiten</Title>
      {!loading && data && <EditMatchForm match={data} />}
      {loading && <LoadingState />}
    </Layout>
  );
};

const LoadingState = () => {
  return <Skeleton className="h-10 w-full rounded-md" />;
};

export default EditMatchPage;
