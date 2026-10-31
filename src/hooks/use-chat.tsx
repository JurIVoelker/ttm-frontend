import { streamChat } from "@/lib/chat-stream";
import { sendRequest } from "@/lib/fetch-utils";
import { queryClient } from "@/lib/query";
import {
  ChatAction,
  ChatConversationDTO,
  ChatEvent,
} from "@/types/chat";
import { useCallback, useEffect, useRef, useState } from "react";

export type ChatItem =
  | { kind: "user"; id: string; text: string }
  | { kind: "assistant"; id: string; text: string }
  | { kind: "action"; id: string; action: ChatAction }
  | { kind: "error"; id: string; message: string };

export type ChatStatus =
  | { state: "idle" }
  | { state: "thinking" }
  | { state: "tool"; toolName: string }
  | { state: "verifying" }
  | { state: "revising" };

let localId = 0;
const nextId = () => `local-${++localId}`;

/** Items of a stored conversation, messages and actions in chronological order. */
const toItems = (conversation: ChatConversationDTO): ChatItem[] => {
  const entries: { at: string; item: ChatItem }[] = [
    ...conversation.messages.map((m) => ({
      at: m.createdAt,
      item:
        m.role === "USER"
          ? ({ kind: "user", id: m.id, text: m.text } as const)
          : ({ kind: "assistant", id: m.id, text: m.text } as const),
    })),
    ...conversation.actions.map((a) => ({
      at: a.createdAt ?? "",
      item: { kind: "action", id: a.id, action: a } as const,
    })),
  ];
  return entries
    .sort((a, b) => a.at.localeCompare(b.at))
    .map((e) => e.item);
};

export const useChat = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [items, setItems] = useState<ChatItem[]>([]);
  const [status, setStatus] = useState<ChatStatus>({ state: "idle" });
  const [loading, setLoading] = useState(false);

  // Assistant bubble that text deltas are currently appended to
  const draftId = useRef<string | null>(null);
  // Set when a write action was executed during the current stream
  const dataChanged = useRef(false);
  // Ids of items loaded from the server (never removed on revision)
  const persistedIds = useRef(new Set<string>());
  // Latest items for event handlers (revision needs to find the last bubble)
  const itemsRef = useRef<ChatItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const busy = status.state !== "idle";
  const hasPendingAction = items.some(
    (i) => i.kind === "action" && i.action.status === "PENDING",
  );

  const handleEvent = useCallback((event: ChatEvent) => {
    switch (event.type) {
      case "conversation":
        setConversationId(event.conversationId);
        break;

      case "text": {
        setStatus((s) => (s.state === "revising" ? s : { state: "thinking" }));
        const id = draftId.current ?? nextId();
        const isNew = draftId.current === null;
        draftId.current = id;
        setItems((prev) =>
          isNew
            ? [...prev, { kind: "assistant", id, text: event.delta }]
            : prev.map((i) =>
                i.id === id && i.kind === "assistant"
                  ? { ...i, text: i.text + event.delta }
                  : i,
              ),
        );
        break;
      }

      case "tool":
        // Text after a tool call belongs to a new message (like in the stored history)
        draftId.current = null;
        setStatus({ state: "tool", toolName: event.toolName });
        break;

      case "confirm":
        draftId.current = null;
        setItems((prev) => [
          ...prev,
          {
            kind: "action",
            id: event.actionId,
            action: {
              id: event.actionId,
              toolName: event.toolName,
              status: "PENDING",
              preview: event.preview,
            },
          },
        ]);
        break;

      case "action_result":
        if (event.status === "DONE") dataChanged.current = true;
        setItems((prev) =>
          prev.map((i) =>
            i.kind === "action" && i.id === event.actionId
              ? {
                  ...i,
                  action: { ...i.action, status: event.status, result: event.result },
                }
              : i,
          ),
        );
        setStatus({ state: "thinking" });
        break;

      case "verifying":
        draftId.current = null;
        setStatus({ state: "verifying" });
        break;

      case "revision": {
        // The last answer is discarded on the server; a corrected one follows.
        const lastAssistant = [...itemsRef.current]
          .reverse()
          .find((i) => i.kind === "assistant");
        draftId.current = null;
        if (lastAssistant && !persistedIds.current.has(lastAssistant.id)) {
          setItems((prev) => prev.filter((i) => i.id !== lastAssistant.id));
        }
        setStatus({ state: "revising" });
        break;
      }

      case "error":
        draftId.current = null;
        setItems((prev) => [
          ...prev,
          { kind: "error", id: nextId(), message: event.message },
        ]);
        break;

      case "done":
        draftId.current = null;
        setStatus({ state: "idle" });
        if (dataChanged.current) {
          dataChanged.current = false;
          // Lineups, matches, teams … may have changed
          void queryClient.invalidateQueries();
        }
        void queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
        break;
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      draftId.current = null;
      setItems((prev) => [...prev, { kind: "user", id: nextId(), text: trimmed }]);
      setStatus({ state: "thinking" });
      await streamChat({
        path: "/api/chat/messages",
        body: { conversationId: conversationId ?? undefined, text: trimmed },
        onEvent: handleEvent,
      });
    },
    [conversationId, handleEvent],
  );

  const resolveAction = useCallback(
    async (actionId: string, approve: boolean) => {
      if (!conversationId) return;
      draftId.current = null;
      setItems((prev) =>
        prev.map((i) =>
          i.kind === "action" && i.id === actionId
            ? { ...i, action: { ...i.action, status: approve ? "APPROVED" : "REJECTED" } }
            : i,
        ),
      );
      setStatus({ state: "thinking" });
      await streamChat({
        path: `/api/chat/conversations/${conversationId}/actions/${actionId}`,
        body: { approve },
        onEvent: handleEvent,
      });
    },
    [conversationId, handleEvent],
  );

  const load = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await sendRequest({
        method: "GET",
        path: `/api/chat/conversations/${id}`,
      });
      if (!response.ok) return false;
      const conversation = (await response.json()) as ChatConversationDTO;
      const loaded = toItems(conversation);
      persistedIds.current = new Set(loaded.map((i) => i.id));
      draftId.current = null;
      setConversationId(conversation.id);
      setItems(loaded);
      setStatus({ state: "idle" });
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    draftId.current = null;
    persistedIds.current = new Set();
    setConversationId(null);
    setItems([]);
    setStatus({ state: "idle" });
  }, []);

  return {
    conversationId,
    items,
    status,
    busy,
    loading,
    hasPendingAction,
    send,
    resolveAction,
    load,
    reset,
  };
};
