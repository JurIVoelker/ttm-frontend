import Layout from "@/components/layout";
import AndroidInstallationGuide from "@/components/notifications/android-installation-guide";
import IosInstallationGuide from "@/components/notifications/ios-installation-guide";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import usePwaInfo from "@/hooks/use-pwa-info";

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
      {subscription && (
        <div>
          <h2>Push-Benachrichtigungen sind aktiviert</h2>
          <Button onClick={unsubscribe}>Deaktivieren</Button>
        </div>
      )}
      {!subscription && (
        <div>
          <h2>Push-Benachrichtigungen sind deaktiviert</h2>
          <Button onClick={subscribe}>Aktivieren</Button>
        </div>
      )}
      {error && <>{error}</>}
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

  return (
    <Layout>
      {/* <IosInstallationGuide /> */}
      {steps.map((step) => step.component)}
      {/* {sub ? (
        <div>
          <h2>Subscribed to Push Notifications</h2>
          <pre>{JSON.stringify(sub.toJSON(), null, 2)}</pre>
          <button onClick={unsubscribe}>Unsubscribe</button>
        </div>
      ) : (
        <div>
          <h2>Not Subscribed to Push Notifications</h2>
          <button onClick={subscribe}>Subscribe</button>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      )} */}
    </Layout>
  );
}

const LoadingState = () => {
  return <Layout>test</Layout>;
};
