import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { ArrowReloadHorizontalIcon } from "hugeicons-react";
import { useRouter } from "next/router";

const Page = () => {
  const { push } = useRouter();

  return (
    <Layout hideSidebar>
      <Title>Verbindung fehlgeschlagen</Title>
      <p className="mt-8">
        Es konnte keine Verbindung zum Server hergestellt werden. Bitte
        überprüfe deine Internetverbindung und versuche es erneut. Sollte das
        Problem weiterhin bestehen, warte bitte einen Moment und versuche es
        später noch einmal.
      </p>
      <Button className="mt-6 w-full" onClick={() => push("/")}>
        <ArrowReloadHorizontalIcon strokeWidth={2} /> Erneut versuchen
      </Button>
    </Layout>
  );
};

export default Page;
