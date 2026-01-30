import Layout from "@/components/layout";
import AndroidInstallationGuide from "@/components/notifications/android-installation-guide";
import IosInstallationGuide from "@/components/notifications/ios-installation-guide";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import usePwaInfo from "@/hooks/use-pwa-info";
import { Notification01Icon, NotificationOff01Icon } from "hugeicons-react";

export default function Home() {
  const {
    isIOS,
    isLoading,
    isStandalone,
    subscription,
    isSupported,
    subscribe,
    unsubscribe,
    error,
    isSubscribing,
  } = usePwaInfo();

  if (isLoading) return <LoadingState />;

  const steps: {
    name: string;
    component: React.ReactElement;
    completed?: boolean;
  }[] = [];

  if (!isSupported) {
    return (
      <Layout>
        <div>
          <h2>
            Push-Benachrichtigungen werden von deinem Gerät/Browser nicht
            unterstützt.
          </h2>
          <p>
            Bitte verwende einen aktuellen Browser wie Chrome, Firefox oder Edge
            auf einem unterstützten Gerät.
          </p>
        </div>
      </Layout>
    );
  }

  const NotificationContent = (
    <div key={3}>
      <Title className="mb-8">Push-Benachrichtigungen</Title>
      <div>
        {subscription && (
          <div className="border p-4 bg-card rounded-md">
            <h2 className="flex items-center gap-1">
              <Notification01Icon className="shrink-0 size-5" strokeWidth={2} />
              Push-Benachrichtigungen sind aktiviert
            </h2>
            <Button onClick={unsubscribe} className="mt-2">
              <NotificationOff01Icon strokeWidth={2} /> Deaktivieren
            </Button>
          </div>
        )}
        {!subscription && (
          <>
            <h2>Push-Benachrichtigungen sind deaktiviert</h2>
            <Button
              onClick={subscribe}
              className="mt-2"
              disabled={isSubscribing}
            >
              Aktivieren
            </Button>
          </>
        )}
        {error && (
          <>
            <h2 className="text-destructive mt-8 text-lg">
              Fehler bei der Aktivierung
            </h2>
            <p className="text-destructive/80 mt-2">{error}</p>
          </>
        )}
      </div>
    </div>
  );

  if (isIOS && !isStandalone)
    steps.push({
      name: "Als IOS-App installieren",
      component: <IosInstallationGuide key={1} />,
    });
  else if (!isIOS && !isStandalone) {
    steps.push({
      name: "Als App installieren",
      component: <AndroidInstallationGuide key={2} />,
    });
  }

  if (isStandalone) {
    steps.push({
      name: "Push-Benachrichtigungen aktivieren",
      component: NotificationContent,
    });
  }

  return <Layout>{steps.map((step) => step.component)}</Layout>;
}

const LoadingState = () => {
  return <Layout>test</Layout>;
};
