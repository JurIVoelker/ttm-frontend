import EditMatchForm from "@/components/edit-match-form";
import Layout from "@/components/layout";
import Title from "@/components/title";
import useFetchMatchById from "@/hooks/use-fetch/use-fetch-match-by-id";
import { usePathname } from "next/navigation";

const EditMatchPage = () => {
  const matchId = usePathname()?.split("/")?.[3];
  const { data, isPending } = useFetchMatchById({ matchId: matchId });

  return (
    <Layout>
      <Title className="mb-6">
        Spiel gegen {data?.enemyName || "unbekannt"} bearbeiten
      </Title>
      {!isPending && data && <EditMatchForm match={data} />}
    </Layout>
  );
};

export default EditMatchPage;
