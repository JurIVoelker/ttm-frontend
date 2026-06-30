import { SyncLogDTO } from "@/types/sync";
import { format, isToday, isYesterday } from "date-fns";
import { de } from "date-fns/locale";

export type DerivedSyncStatus = "success" | "partial" | "failed";

export const deriveSyncStatus = (log: SyncLogDTO): DerivedSyncStatus => {
  const okCount = log.successfulSyncsCount + log.updatedMatchesCount;
  if (log.failedSyncsCount === 0) return "success";
  if (okCount > 0) return "partial";
  return "failed";
};

export const syncStatusConfig: Record<
  DerivedSyncStatus,
  { label: string; dot: string; text: string }
> = {
  success: {
    label: "Erfolgreich",
    dot: "bg-positive-dark",
    text: "text-positive-dark",
  },
  partial: {
    label: "Teilweise",
    dot: "bg-neutral-dark",
    text: "text-neutral-dark",
  },
  failed: {
    label: "Fehlgeschlagen",
    dot: "bg-negative-dark",
    text: "text-negative-dark",
  },
};

const formatRelativeDay = (date: Date): string => {
  if (isToday(date)) return "Heute";
  if (isYesterday(date)) return "Gestern";
  return format(date, "d. MMMM", { locale: de });
};

export const formatSyncTitle = (iso: string): string => {
  const date = new Date(iso);
  return `${formatRelativeDay(date)} · ${format(date, "HH:mm")}`;
};

export const formatFullDate = (iso: string): string =>
  format(new Date(iso), "d. MMMM yyyy", { locale: de });

export const formatSyncTime = (iso: string): string =>
  `${format(new Date(iso), "HH:mm")} Uhr`;

export const formatMatchDatetime = (iso: string): string => {
  const date = new Date(iso);
  return `${format(date, "EEEEEE dd.MM.", { locale: de })} · ${format(date, "HH:mm")} Uhr`;
};

export const buildSyncSummary = (log: SyncLogDTO): string => {
  const parts: string[] = [];
  if (log.successfulSyncsCount) parts.push(`${log.successfulSyncsCount} neu`);
  if (log.updatedMatchesCount)
    parts.push(`${log.updatedMatchesCount} aktualisiert`);
  if (log.failedSyncsCount)
    parts.push(`${log.failedSyncsCount} fehlgeschlagen`);
  return parts.length ? parts.join(" · ") : "Keine Änderungen";
};

export const getProcessedCount = (log: SyncLogDTO): number =>
  log.successfulSyncsCount + log.updatedMatchesCount + log.failedSyncsCount;
