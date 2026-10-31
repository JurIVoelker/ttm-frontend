import { cn } from "@/lib/utils";
import { ChatMatchCardData, ChatPlayerRef, ChatPreviewCompare } from "@/types/chat";
import { MatchCardHighlight, MatchCardView } from "./chat-match-cards";

const sameLocation = (a: ChatMatchCardData["location"], b: ChatMatchCardData["location"]) =>
  JSON.stringify(a) === JSON.stringify(b);

const changedFields = (a: ChatMatchCardData, b: ChatMatchCardData) => {
  const changed: NonNullable<MatchCardHighlight["changed"]> = new Set();
  if (a.time !== b.time) changed.add("time");
  if (!sameLocation(a.location, b.location)) changed.add("location");
  if (a.isHomeGame !== b.isHomeGame) changed.add("home");
  if (a.type !== b.type) changed.add("type");
  return changed;
};

const idsOf = (players: ChatPlayerRef[]) => new Set(players.map((p) => p.id));

/** Before (left) and after (right) of a proposed change; stacked on small screens. */
const ChatCompare = ({ compare }: { compare: ChatPreviewCompare }) => {
  if (compare.kind === "match") {
    const { before, after } = compare;
    const beforeIds = idsOf(before?.lineup ?? []);
    const afterIds = idsOf(after?.lineup ?? []);
    const changed = before && after ? changedFields(before, after) : undefined;

    return (
      <CompareGrid
        before={
          before ? (
            <MatchCardView
              match={before}
              highlight={{
                removed: new Set([...beforeIds].filter((id) => after && !afterIds.has(id))),
              }}
            />
          ) : (
            <Placeholder>Neues Spiel</Placeholder>
          )
        }
        after={
          after ? (
            <MatchCardView
              match={after}
              highlight={{
                added: new Set([...afterIds].filter((id) => before && !beforeIds.has(id))),
                changed,
              }}
            />
          ) : (
            <Placeholder destructive>Spiel wird gelöscht</Placeholder>
          )
        }
      />
    );
  }

  const beforeIds = idsOf(compare.before);
  const afterIds = idsOf(compare.after);
  return (
    <CompareGrid
      before={<PlayerList players={compare.before} mark={(id) => !afterIds.has(id) && "removed"} />}
      after={<PlayerList players={compare.after} mark={(id) => !beforeIds.has(id) && "added"} />}
    />
  );
};

const CompareGrid = ({ before, after }: { before: React.ReactNode; after: React.ReactNode }) => (
  <div className="mt-3 grid gap-3 sm:grid-cols-2">
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Vorher</p>
      {before}
    </div>
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Nachher</p>
      {after}
    </div>
  </div>
);

const Placeholder = ({ children, destructive }: { children: React.ReactNode; destructive?: boolean }) => (
  <div
    className={cn(
      "flex h-full min-h-24 items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground",
      destructive && "border-negative-border bg-negative-light text-negative-dark",
    )}
  >
    {children}
  </div>
);

const PlayerList = ({
  players,
  mark,
}: {
  players: ChatPlayerRef[];
  mark: (id: string) => "added" | "removed" | false;
}) =>
  players.length === 0 ? (
    <Placeholder>Keine Spieler</Placeholder>
  ) : (
    <ol className="space-y-1 rounded-2xl border bg-card p-4">
      {players.map((p, i) => {
        const state = mark(p.id);
        return (
          <li
            key={p.id}
            className={cn(
              "flex items-center gap-1.5 text-sm",
              state === "added" && "text-positive-dark font-medium",
              state === "removed" && "text-negative-dark line-through",
            )}
          >
            <span className="size-5 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {i + 1}
            </span>
            {p.fullName}
          </li>
        );
      })}
    </ol>
  );

export default ChatCompare;
