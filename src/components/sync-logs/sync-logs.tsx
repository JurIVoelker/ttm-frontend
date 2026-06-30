import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetchSyncLogs } from "@/hooks/use-fetch/use-fetch-sync-logs";
import { cn } from "@/lib/utils";
import { SyncLogDTO } from "@/types/sync";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { SyncLogDetailSheet } from "./sync-log-detail-sheet";
import {
  buildSyncSummary,
  deriveSyncStatus,
  formatSyncTitle,
  syncStatusConfig,
} from "./sync-log-helpers";

const PAGE_SIZE = 3;

const SyncLogs = ({ className }: { className?: string }) => {
  const { data: logs } = useFetchSyncLogs();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedSyncId, setSelectedSyncId] = useState<string | null>(null);

  return (
    <div className={className}>
      <h2 className="text-lg font-medium">Letzte Synchronisationen</h2>

      {!logs || logs.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-sm">
          Noch keine Synchronisationen vorhanden
        </p>
      ) : (
        <SyncLogList
          logs={logs}
          visibleCount={visibleCount}
          onShowMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
          onSelect={setSelectedSyncId}
        />
      )}

      <SyncLogDetailSheet
        sync={logs?.find((log) => log.id === selectedSyncId) ?? null}
        open={selectedSyncId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSyncId(null);
        }}
      />
    </div>
  );
};

const SyncLogList = ({
  logs,
  visibleCount,
  onShowMore,
  onSelect,
}: {
  logs: SyncLogDTO[];
  visibleCount: number;
  onShowMore: () => void;
  onSelect: (id: string) => void;
}) => {
  const visibleLogs = logs.slice(0, visibleCount);
  const remaining = logs.length - visibleLogs.length;

  return (
    <>
      <div className="mt-3 divide-y rounded-md border">
        {visibleLogs.map((log) => (
          <SyncLogRow key={log.id} log={log} onSelect={() => onSelect(log.id)} />
        ))}
      </div>

      {remaining > 0 && (
        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={onShowMore}
        >
          Ältere anzeigen · {remaining}
        </Button>
      )}

      <p className="text-muted-foreground mt-2 text-center text-xs">
        {visibleLogs.length} von {logs.length} Synchronisationen
      </p>
    </>
  );
};

const SyncLogRow = ({
  log,
  onSelect,
}: {
  log: SyncLogDTO;
  onSelect: () => void;
}) => {
  const status = deriveSyncStatus(log);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="hover:bg-muted/50 flex min-h-[44px] w-full items-center gap-3 px-3 py-3 text-left transition-colors first:rounded-t-md last:rounded-b-md"
    >
      <span
        className={cn("size-2.5 shrink-0 rounded-full", syncStatusConfig[status].dot)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">
            {formatSyncTitle(log.createdAt)}
          </span>
          {log.trigger === "MANUAL" && (
            <Badge
              variant="outline"
              className="shrink-0 px-1.5 py-0 text-[10px] font-normal"
            >
              Manuell
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground truncate text-xs">
          {buildSyncSummary(log)}
        </p>
      </div>
      <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" />
    </button>
  );
};

export default SyncLogs;
