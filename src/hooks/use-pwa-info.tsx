import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { getVapidUint8ArrayKey } from "@/lib/push-notifications";
import { useEffect, useState } from "react";

const usePwaInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [sub, setSub] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setIsIOS(
      // @ts-expect-error any for iOS detection
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    setIsSupported(true);

    (async () => {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw?.pushManager.getSubscription();
      if (!sub) return;
      setSub(sub);
    })();

    setIsLoading(false);
  }, []);

  const unsubscribe = async () => {
    await sub?.unsubscribe();
    setSub(null);
  };

  const subscribe = async () => {
    try {
      console.log("Subscribing to push notifications...");
      setIsSubscribing(true);
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("Service Worker Registrierung nicht gefunden.");
      }
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
      showMessage("Benachrichtigungen wurden erfolgreich aktiviert");
      setTimeout(() => {
        showMessage(
          "Überprüfe, ob die Testbenachrichtigung bei dir angekommen ist.",
        );
      }, 4000);
    } catch (error) {
      if (error instanceof Error) {
        setError(
          `${error.message} ${error.name} ${error.stack} ${JSON.stringify(error.cause)}`,
        );
      }
      console.error("Subscription failed: ", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return {
    isLoading,
    isIOS,
    isStandalone,
    subscription: sub,
    unsubscribe,
    error,
    subscribe,
    isSupported,
    isSubscribing,
  };
};

export default usePwaInfo;
