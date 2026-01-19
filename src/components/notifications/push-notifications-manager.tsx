import { showMessage } from "@/lib/message";
import { urlBase64ToUint8Array } from "@/lib/push-notifications";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { sendRequest } from "@/lib/fetch-utils";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    setIsLoading(true);
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    setSubscription(sub);
    await sendRequest({
      path: "/api/notifications/subscribe",
      method: "POST",
      body: sub.toJSON(),
    });
    setIsLoading(false);
    showMessage("Benachrichtigungen wurden aktiviert.");
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    // await unsubscribeUser();
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <Button onClick={unsubscribeFromPush}>Abbestellen</Button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <Button onClick={subscribeToPush} disabled={isLoading}>
            Benachrichtigungen aktivieren
          </Button>
        </>
      )}
    </div>
  );
}
