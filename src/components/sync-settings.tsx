import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useFetchSyncSettings } from "@/hooks/use-fetch/use-fetch-sync-settings";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { queryClient } from "@/lib/query";
import { Settings } from "@/types/sync";

interface SyncSettingsProps {
  className?: string;
  onSave?: (settings: Settings) => void;
}
const SyncSettings = (props: SyncSettingsProps) => {
  const settings = useFetchSyncSettings();

  const [isLoading, setLoading] = useState(false);

  const onSaveSettings = async () => {
    setLoading(true);
    const response = await sendRequest({
      method: "POST",
      path: "/api/sync/settings",
      body: {
        autoSync: settings.data?.autoSync,
        includeRRSync: settings.data?.includeRRSync,
      },
    });

    if (!response.ok) {
      showMessage("Fehler beim Speichern der Einstellungen", {
        variant: "error",
      });
      setLoading(false);
      return;
    }

    const json = await response.json();

    showMessage("Einstellungen erfolgreich gespeichert");
    setLoading(false);
    queryClient.setQueryData(["sync-settings"], json);
    if (props.onSave) {
      props?.onSave(json);
    }
  };

  return (
    <>
      <p className="text-muted-foreground mt-6 text-sm">
        Stelle deine Synchronisationseinstellungen ein.
      </p>
      <form
        className="space-y-3 mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSaveSettings();
        }}
      >
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
        <Button
          onClick={onSaveSettings}
          disabled={isLoading}
          className="mt-6 w-full"
        >
          Speichern
        </Button>
      </form>
    </>
  );
};

export default SyncSettings;
