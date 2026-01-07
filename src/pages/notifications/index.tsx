import InstallPrompt from "@/components/notifications/install-prompts";
import { PushNotificationManager } from "@/components/notifications/push-notifications-manager";

const NotificationPage = () => {
  return (
    <>
      <PushNotificationManager />
      <InstallPrompt />
    </>
  );
};

export default NotificationPage;
