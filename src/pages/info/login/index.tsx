import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";

const Page = () => {
  const { push } = useRouter();

  const onLogin = () => {
    push("/login");
  };

  return (
    <Layout hideSidebar>
      <Title>Willkommen</Title>
      <div className="space-y-4 mt-8">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Login für Spieler</h2>
          <p>
            Du bist nicht eingeloggt. Du benötigst einen Login-Link von deinem
            Mannschaftsführer, um dich einzuloggen. Bitte kontaktiere deinen
            Mannschaftsführer, um einen Login-Link zu erhalten.
          </p>
        </section>
        <Separator />
        <section>
          <h2 className="text-lg font-medium">Login für Mannschaftsführer</h2>
          <p className="mt-2">
            Falls du Mannschaftsführer bist, klicke auf diesen Button, um dich
            einzuloggen:
          </p>
          <Button className="mt-3 w-full" onClick={onLogin}>
            Zum Login
          </Button>
        </section>
      </div>
    </Layout>
  );
};

export default Page;
