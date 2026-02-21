import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useFetchSyncSettings } from "@/hooks/use-fetch/use-fetch-sync-settings";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";

interface SyncSettingsProps {
  className?: string;
  onSave?: () => void;
}
const SyncSettings = (props: SyncSettingsProps) => {
  const settings = useFetchSyncSettings();

  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

    showMessage("Einstellungen erfolgreich gespeichert");
    setIsOpen(false);
    setLoading(false);
    settings.refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={props.className}>
        <Button>
          <SettingsIcon /> Einstellungen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Synchronisationseinstellungen</DialogTitle>
        <DialogDescription>
          Stelle deine Synchronisationseinstellungen ein.
        </DialogDescription>
        <form
          className="space-y-3 mt-3"
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
                  settings.setData({
                    ...settings.data,
                    autoSync: !settings.data.autoSync,
                  });
                }
              }}
            />
            <Label htmlFor="auto-sync-switch">
              Automatische Synchronisation
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="include-rr-sync-switch"
              checked={settings.data?.includeRRSync}
              onCheckedChange={() => {
                if (settings.data) {
                  settings.setData({
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
        </form>
        <DialogFooter>
          <Button onClick={onSaveSettings} disabled={isLoading}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncSettings;
