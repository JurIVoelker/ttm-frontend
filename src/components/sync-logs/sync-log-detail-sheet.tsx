import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { SyncLogDTO, SyncMatchDetail } from "@/types/sync";
import { XIcon } from "lucide-react";
import {
  deriveSyncStatus,
  formatFullDate,
  formatMatchDatetime,
  formatSyncTime,
  formatSyncTitle,
  getProcessedCount,
  syncStatusConfig,
} from "./sync-log-helpers";

type SyncLogDetailSheetProps = {
  sync: SyncLogDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SyncLogDetailSheet = ({
  sync,
  open,
  onOpenChange,
}: SyncLogDetailSheetProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>{sync && <DetailContent sync={sync} />}</DrawerContent>
    </Drawer>
  );
};

const DetailContent = ({ sync }: { sync: SyncLogDTO }) => {
  const status = deriveSyncStatus(sync);
  const groups = [
    {
      key: "successfulSyncs",
      label: "Neu synchronisiert",
      dot: "bg-positive-dark",
      items: sync.details?.successfulSyncs ?? [],
    },
    {
      key: "updatedMatches",
      label: "Aktualisiert",
      dot: "bg-neutral-dark",
      items: sync.details?.updatedMatches ?? [],
    },
    {
      key: "failedSyncs",
      label: "Fehlgeschlagen",
      dot: "bg-negative-dark",
      items: sync.details?.failedSyncs ?? [],
    },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      <div className="flex items-start justify-between gap-2 p-4 pb-3 text-left">
        <div className="min-w-0">
          <DrawerTitle className="text-lg">
            {formatSyncTitle(sync.createdAt)}
          </DrawerTitle>
          <DrawerDescription>
            {formatFullDate(sync.createdAt)}
          </DrawerDescription>
        </div>
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1 -mt-1 shrink-0"
            aria-label="Schließen"
          >
            <XIcon className="size-4" />
          </Button>
        </DrawerClose>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-2">
          <MetaTile label="Status">
            <span className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", syncStatusConfig[status].dot)} />
              <span className={syncStatusConfig[status].text}>
                {syncStatusConfig[status].label}
              </span>
            </span>
          </MetaTile>
          <MetaTile label="Auslöser">
            {sync.trigger === "MANUAL" ? "Manuell" : "Automatisch"}
          </MetaTile>
          <MetaTile label="Verarbeitet">{getProcessedCount(sync)} Spiele</MetaTile>
          <MetaTile label="Uhrzeit">{formatSyncTime(sync.createdAt)}</MetaTile>
        </div>

        {groups.map((group) => (
          <div key={group.key} className="mt-5">
            <div className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", group.dot)} />
              <span className="text-sm font-medium">{group.label}</span>
              <span className="text-muted-foreground text-sm">
                {group.items.length}
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {group.items.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const MetaTile = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-md border p-3">
    <p className="text-muted-foreground text-xs">{label}</p>
    <div className="mt-1 text-sm font-medium">{children}</div>
  </div>
);

const MatchCard = ({ match }: { match: SyncMatchDetail }) => (
  <div className="rounded-md border p-3 text-sm">
    <div>
      {match.home} <span className="text-muted-foreground">vs</span> {match.away}
    </div>
    <p className="text-muted-foreground mt-0.5 text-xs">
      {formatMatchDatetime(match.datetime)}
      {match.reason ? ` · ${match.reason}` : ""}
    </p>
  </div>
);
