import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useFetchSyncSettings } from "@/hooks/use-fetch/use-fetch-sync-settings";
import { queryClient } from "@/lib/query";
import { cn } from "@/lib/utils";

interface SyncSettingsProps {
  className?: string;
}
const SyncSettings = (props: SyncSettingsProps) => {
  const settings = useFetchSyncSettings();

  return (
    <div className={cn(props.className)}>
      <p className="text-muted-foreground text-sm">
        Stelle deine Synchronisationseinstellungen ein.
      </p>
      <div className="space-y-3 mt-5">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-sync-switch"
            checked={settings.data?.autoSync}
            onCheckedChange={() => {
              if (settings.data) {
                queryClient.setQueryData(["sync-settings"], {
                  ...settings.data,
                  autoSync: !settings.data.autoSync,
                });
              }
            }}
          />
          <Label htmlFor="auto-sync-switch">Automatische Synchronisation</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="include-rr-sync-switch"
            checked={settings.data?.includeRRSync}
            onCheckedChange={() => {
              if (settings.data) {
                queryClient.setQueryData(["sync-settings"], {
                  ...settings.data,
                  includeRRSync: !settings.data.includeRRSync,
                });
              }
            }}
          />
          <Label htmlFor="include-rr-sync-switch">
            Rückrunde Synchronisieren
          </Label>
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;
