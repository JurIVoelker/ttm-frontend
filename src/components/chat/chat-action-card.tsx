import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatAction } from "@/types/chat";
import { Edit02Icon } from "hugeicons-react";
import ChatCompare from "./chat-compare";

const statusBadge: Record<
  ChatAction["status"],
  { label: string; variant: "positive" | "negative" | "neutral" | "secondary" } | null
> = {
  PENDING: null,
  APPROVED: { label: "Wird ausgeführt …", variant: "secondary" },
  DONE: { label: "Ausgeführt", variant: "positive" },
  REJECTED: { label: "Verworfen", variant: "neutral" },
  FAILED: { label: "Fehlgeschlagen", variant: "negative" },
};

const errorOf = (result: unknown) =>
  result && typeof result === "object" && "error" in result
    ? String((result as { error: unknown }).error)
    : null;

const ChatActionCard = ({
  action,
  disabled,
  onResolve,
}: {
  action: ChatAction;
  disabled: boolean;
  onResolve: (approve: boolean) => void;
}) => {
  const badge = statusBadge[action.status];
  const error = action.status === "FAILED" ? errorOf(action.result) : null;
  const pending = action.status === "PENDING";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-xs",
        pending && "border-neutral-border pulse-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <Edit02Icon strokeWidth={2} className="size-4.5 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="font-medium text-sm">
            {action.preview?.title ?? action.toolName}
          </p>
        </div>
        {badge && (
          <Badge variant={badge.variant} className="shrink-0">
            {badge.label}
          </Badge>
        )}
      </div>

      {action.preview?.compare && <ChatCompare compare={action.preview.compare} />}

      {!action.preview?.compare && !!action.preview?.details.length && (
        <ul className="mt-2 ml-6.5 space-y-1 text-sm text-muted-foreground">
          {action.preview.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 ml-6.5 text-sm text-negative-dark">{error}</p>}

      {pending && (
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="negative" size="sm" disabled={disabled} onClick={() => onResolve(false)}>
            Verwerfen
          </Button>
          <Button variant="positive" size="sm" disabled={disabled} onClick={() => onResolve(true)}>
            Bestätigen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatActionCard;
