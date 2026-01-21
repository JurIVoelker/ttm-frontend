export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const getVapidUint8ArrayKey = () => {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    throw new Error("VAPID public key is not defined in environment variables");
  }
  return urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "");
};

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    console.log("Registering SW...");
    await navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("SW registration failed: ", error);
    });
    console.log("SW registered.");
  }
};
