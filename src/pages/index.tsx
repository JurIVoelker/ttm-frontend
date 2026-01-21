import Layout from "@/components/layout";
import { sendRequest } from "@/lib/fetch-utils";
import { getVapidUint8ArrayKey } from "@/lib/push-notifications";
import { useEffect, useState } from "react";

export default function Home() {
  const [sub, setSub] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw?.pushManager.getSubscription();
      if (!sub) return;
      setSub(sub);
    })();
  }, []);

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: getVapidUint8ArrayKey(),
      });
      setSub(sub);
      await sendRequest({
        path: "/api/notifications/subscribe",
        method: "POST",
        body: sub.toJSON(),
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(
          `${error.message} ${error.name} ${error.stack} ${JSON.stringify(error.cause)}`,
        );
      }
      console.error("Subscription failed: ", error);
    }
  };

  const unsubscribe = async () => {
    await sub?.unsubscribe();
    setSub(null);
  };

  return (
    <Layout>
      {sub ? (
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
      )}
    </Layout>
  );
}
