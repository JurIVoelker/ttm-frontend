import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/use-fetch/use-fetch";
import { cn } from "@/lib/utils";
import { ChatMatchCardData, ChatMatchCardDTO } from "@/types/chat";
import { format } from "date-fns";
import { Calendar02Icon, Location01Icon } from "hugeicons-react";
import Link from "next/link";

/**
 * Slim version of the match cards from the team page, rendered for ```spiele
 * blocks in assistant answers. The data is loaded from the database by id, so
 * what the cards show doesn't depend on the model's text.
 */
const ChatMatchCards = ({ ids, streaming }: { ids: string[]; streaming: boolean }) => {
  const { data, isLoading, isError } = useFetchData<{ matches: ChatMatchCardDTO[] }>({
    method: "POST",
    path: "/api/chat/matches",
    body: { ids },
    queryKey: `chat-matches-${ids.join(",")}`,
    // The block may still be incomplete while the answer streams in
    ready: !streaming && ids.length > 0,
  });

  if (streaming || isLoading) {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {ids.slice(0, 4).map((id) => (
          <Skeleton key={id} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="mt-3 text-sm text-muted-foreground">Spiele konnten nicht geladen werden.</p>;
  }

  if (data.matches.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">Keine Spiele gefunden.</p>;
  }

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {data.matches.map((match) => (
        <MatchCardView key={match.id} match={match} />
      ))}
    </div>
  );
};

export type MatchCardHighlight = {
  /** Lineup players to mark as added (green) */
  added?: Set<string>;
  /** Lineup players to mark as removed (red, struck through) */
  removed?: Set<string>;
  /** Fields that differ from the other side of a comparison */
  changed?: Set<"time" | "location" | "home" | "type">;
};

const changedClass = "text-positive-dark font-medium";

/** Slim match card; also used for the before/after view of confirmations. */
export const MatchCardView = ({
  match,
  highlight,
}: {
  match: ChatMatchCardData;
  highlight?: MatchCardHighlight;
}) => {
  const time = new Date(match.time);
  const changed = highlight?.changed;

  return (
    <Card className="rounded-2xl gap-3 p-4 animate-pop-in-subtle">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/${match.teamSlug}`}
            className="text-xs text-muted-foreground hover:underline underline-offset-4"
          >
            {match.teamName}
          </Link>
          <p className="font-semibold leading-tight truncate">{match.enemyName}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1 shrink-0">
          <Badge className={cn(changed?.has("home") && "ring-2 ring-positive-border")}>
            {match.isHomeGame ? "Heimspiel" : "Auswärtsspiel"}
          </Badge>
          {match.type === "CUP" && (
            <Badge className={cn(changed?.has("type") && "ring-2 ring-positive-border")}>
              Pokalspiel
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <InfoItem Icon={Calendar02Icon} className={cn(changed?.has("time") && changedClass)}>
          {format(time, "dd.MM.yyyy")} um {format(time, "HH:mm")} Uhr
        </InfoItem>
        {(match.location || changed?.has("location")) && (
          <InfoItem Icon={Location01Icon} className={cn(changed?.has("location") && changedClass)}>
            {match.location ? `${match.location.hallName}, ${match.location.city}` : "Kein Ort"}
          </InfoItem>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold">Aufstellung</h3>
        {match.lineup.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">Noch keine Aufstellung</p>
        ) : (
          <ol className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
            {match.lineup.map((p, i) => {
              const added = highlight?.added?.has(p.id);
              const removed = highlight?.removed?.has(p.id);
              return (
                <li
                  key={p.id}
                  className={cn(
                    "flex items-center gap-1.5 text-sm",
                    added && "text-positive-dark font-medium",
                    removed && "text-negative-dark line-through",
                  )}
                >
                  <span
                    className={cn(
                      "size-5 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium no-underline",
                      added && "bg-positive-light text-positive-dark",
                      removed && "bg-negative-light text-negative-dark",
                    )}
                  >
                    {i + 1}
                  </span>
                  {p.fullName}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Once a lineup is set, votes no longer matter (same as the team page) */}
      {match.availability && match.lineup.length === 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <Count className="text-positive-dark" label="zugesagt" value={match.availability.available} />
          <Count className="text-negative-dark" label="abgesagt" value={match.availability.unavailable} />
          <Count className="text-neutral-dark" label="unsicher" value={match.availability.unknown} />
          <Count label="offen" value={match.availability.notResponded} />
        </div>
      )}
    </Card>
  );
};

const InfoItem = ({
  Icon,
  children,
  className,
}: {
  Icon: React.ComponentType<React.ComponentProps<typeof Calendar02Icon>>;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex gap-1.5 text-sm items-center", className)}>
    <Icon className="shrink-0 size-4.5 text-muted-foreground" strokeWidth={2} />
    <div className="min-w-0 truncate">{children}</div>
  </div>
);

const Count = ({ label, value, className }: { label: string; value: number; className?: string }) => (
  <span className={cn(value > 0 && className)}>
    <span className="font-semibold">{value}</span> {label}
  </span>
);

export default ChatMatchCards;
