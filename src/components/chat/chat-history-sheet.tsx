import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchChatConversations } from "@/hooks/use-fetch/use-fetch-chat-conversations";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Delete02Icon } from "hugeicons-react";
import { useState } from "react";

const ChatHistorySheet = ({
  open,
  onOpenChange,
  activeId,
  onSelect,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onDeleted: (id: string) => void;
}) => {
  const { data, isLoading, refetch } = useFetchChatConversations(open);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const onDelete = async () => {
    if (!deleteId) return;
    const response = await sendRequest({
      method: "DELETE",
      path: `/api/chat/conversations/${deleteId}`,
    });
    if (!response.ok) return;
    showMessage("Unterhaltung gelöscht");
    onDeleted(deleteId);
    setDeleteId(null);
    refetch();
  };

  const conversations = data?.conversations ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Verlauf</SheetTitle>
          <SheetDescription>Deine bisherigen Unterhaltungen</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          {!isLoading && conversations.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              Noch keine Unterhaltungen
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-1 rounded-md hover:bg-accent",
                c.id === activeId && "bg-accent",
              )}
            >
              <button
                className="flex-1 min-w-0 text-left px-3 py-2"
                onClick={() => onSelect(c.id)}
              >
                <p className="text-sm truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.updatedAt), {
                    addSuffix: true,
                    locale: de,
                  })}
                </p>
              </button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Unterhaltung löschen"
                className="mr-1 text-muted-foreground"
                onClick={() => setDeleteId(c.id)}
              >
                <Delete02Icon strokeWidth={2} />
              </Button>
            </div>
          ))}
        </div>
        <ConfirmDialog
          title="Unterhaltung löschen"
          description="Möchtest du diese Unterhaltung wirklich löschen?"
          open={deleteId !== null}
          setOpen={(o) => !o && setDeleteId(null)}
          onConfirm={onDelete}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatHistorySheet;
