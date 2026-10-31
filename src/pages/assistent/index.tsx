import ChatActionCard from "@/components/chat/chat-action-card";
import ChatCopyButton from "@/components/chat/chat-copy-button";
import ChatHistorySheet from "@/components/chat/chat-history-sheet";
import ChatInput from "@/components/chat/chat-input";
import ChatMarkdown from "@/components/chat/chat-markdown";
import ChatStatusIndicator from "@/components/chat/chat-status";
import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/hooks/use-auth-store";
import { ChatItem, useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { Clock01Icon, PlusSignIcon, SparklesIcon } from "hugeicons-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Welche Spiele kollidieren in den nächsten zwei Wochen?",
  "Wer hat für die nächsten Spiele meiner Mannschaften noch nicht abgestimmt?",
  "Fasse die Aufstellungen der nächsten Spiele zusammen.",
];

const AssistantPage = () => {
  const router = useRouter();
  const { authStore, loading: authLoading } = useAuthStore();
  const chat = useChat();
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const roles = authStore.jwtDecoded?.roles ?? [];
  const allowed = roles.includes("leader") || roles.includes("admin");
  const queryId = typeof router.query.c === "string" ? router.query.c : null;

  // Load the conversation from the URL (?c=…), e.g. after a reload
  useEffect(() => {
    if (!router.isReady || !allowed) return;
    if (queryId && queryId !== chat.conversationId) {
      chat.load(queryId).then((ok) => {
        if (!ok) router.replace("/assistent", undefined, { shallow: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, queryId, allowed]);

  // Keep the URL in sync once a new conversation was created
  useEffect(() => {
    if (chat.conversationId && chat.conversationId !== queryId) {
      router.replace({ query: { c: chat.conversationId } }, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.conversationId]);

  // Follow new content unless the user scrolled up
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [chat.items, chat.status]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const send = (text: string) => {
    stickToBottom.current = true;
    chat.send(text);
  };

  const newChat = () => {
    chat.reset();
    router.replace("/assistent", undefined, { shallow: true });
  };

  if (authLoading) return <Layout />;

  if (!allowed) {
    return (
      <Layout>
        <Title>KI Assistent</Title>
        <p className="text-muted-foreground mt-6">
          Der KI Assistent ist nur für Mannschaftsführer und Admins verfügbar.
        </p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Zum Login
        </Button>
      </Layout>
    );
  }

  const inputDisabled = chat.busy || chat.hasPendingAction;
  // The last item may still be streaming (incomplete match blocks aren't loaded yet)
  const lastItemId = chat.items[chat.items.length - 1]?.id;

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100dvh-9.5rem)] md:h-[calc(100dvh-5.5rem)]">
        <Title>KI Assistent</Title>
        <div className="flex justify-center md:justify-end gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
            <Clock01Icon strokeWidth={2} />
            Verlauf
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={newChat}
            disabled={chat.busy || (!chat.conversationId && chat.items.length === 0)}
          >
            <PlusSignIcon strokeWidth={2} />
            Neuer Chat
          </Button>
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto -mx-2 px-2 py-4 space-y-4"
        >
          {chat.loading && <LoadingState />}

          {!chat.loading && chat.items.length === 0 && (
            <EmptyState onSelect={send} />
          )}

          {chat.items.map((item) => (
            <ChatItemView
              key={item.id}
              item={item}
              disabled={chat.busy}
              streaming={chat.busy && item.id === lastItemId}
              onResolve={chat.resolveAction}
            />
          ))}

          <ChatStatusIndicator status={chat.status} />
        </div>

        <div className="pt-2">
          {chat.hasPendingAction && !chat.busy && (
            <p className="text-xs text-muted-foreground mb-2 text-center">
              Bitte bestätige oder verwirf zuerst die vorgeschlagene Änderung.
            </p>
          )}
          <ChatInput
            disabled={inputDisabled}
            onSend={send}
            placeholder="Frag nach Spielen, Aufstellungen, Spielern …"
          />
          <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
            Der Assistent kann Fehler machen. Änderungen werden erst nach deiner Bestätigung ausgeführt.
          </p>
        </div>
      </div>

      <ChatHistorySheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        activeId={chat.conversationId}
        onSelect={(id) => {
          setHistoryOpen(false);
          stickToBottom.current = true;
          router.replace({ query: { c: id } }, undefined, { shallow: true });
        }}
        onDeleted={(id) => {
          if (id === chat.conversationId) newChat();
        }}
      />
    </Layout>
  );
};

const ChatItemView = ({
  item,
  disabled,
  streaming,
  onResolve,
}: {
  item: ChatItem;
  disabled: boolean;
  streaming: boolean;
  onResolve: (actionId: string, approve: boolean) => void;
}) => {
  switch (item.kind) {
    case "user":
      return (
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2 text-sm whitespace-pre-wrap break-words">
            {item.text}
          </div>
        </div>
      );
    case "assistant":
      return (
        <div className="max-w-full md:max-w-[90%]">
          <ChatMarkdown text={item.text} streaming={streaming} />
          {!streaming && (
            <div className="mt-1 -ml-2">
              <ChatCopyButton markdown={item.text} />
            </div>
          )}
        </div>
      );
    case "action":
      return (
        <ChatActionCard
          action={item.action}
          disabled={disabled}
          onResolve={(approve) => onResolve(item.id, approve)}
        />
      );
    case "error":
      return (
        <div className="rounded-md border border-negative-border bg-negative-light px-3 py-2 text-sm text-negative-dark">
          {item.message}
        </div>
      );
  }
};

const EmptyState = ({ onSelect }: { onSelect: (text: string) => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
    <SparklesIcon strokeWidth={2} className="size-10 text-muted-foreground" />
    <p className="text-muted-foreground text-sm max-w-sm">
      Frag den Assistenten nach Mannschaften, Spielern, Spielen, Aufstellungen
      oder Kollisionen. Er kann auch Änderungen vorbereiten.
    </p>
    <div className="flex flex-col gap-2 mt-2 w-full max-w-md">
      {SUGGESTIONS.map((s) => (
        <Button
          key={s}
          variant="outline"
          className={cn("h-auto whitespace-normal text-left justify-start py-2")}
          onClick={() => onSelect(s)}
        >
          {s}
        </Button>
      ))}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-2/3 ml-auto" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export default AssistantPage;
