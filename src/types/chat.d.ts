export type ChatActionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "DONE"
  | "FAILED";

export type ChatPlayerRef = { id: string; fullName: string };

/** State before/after a write action (null = doesn't exist before/after). */
export type ChatPreviewCompare =
  | {
      kind: "match";
      before: ChatMatchCardData | null;
      after: ChatMatchCardData | null;
    }
  | { kind: "players"; before: ChatPlayerRef[]; after: ChatPlayerRef[] };

export type ChatActionPreview = {
  title: string;
  details: string[];
  compare?: ChatPreviewCompare;
};

export type ChatAction = {
  id: string;
  messageId?: string;
  toolName: string;
  status: ChatActionStatus;
  preview: ChatActionPreview | null;
  result?: unknown;
  createdAt?: string;
};

export type ChatMessageDTO = {
  id: string;
  role: "USER" | "ASSISTANT";
  text: string;
  createdAt: string;
};

export type ChatConversationDTO = {
  id: string;
  title: string;
  messages: ChatMessageDTO[];
  actions: ChatAction[];
};

export type ChatConversationSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

/** Server-sent events of a chat turn (mirrors the backend's ChatEvent). */
export type ChatEvent =
  | { type: "conversation"; conversationId: string; title: string }
  | { type: "text"; delta: string }
  | { type: "tool"; toolName: string; status: "done" | "failed" }
  | {
      type: "confirm";
      actionId: string;
      toolName: string;
      preview: ChatActionPreview;
    }
  | {
      type: "action_result";
      actionId: string;
      status: "DONE" | "FAILED" | "REJECTED";
      result: unknown;
    }
  | { type: "verifying" }
  | { type: "revision"; issues: string[] }
  | { type: "done"; awaitingConfirmation: boolean }
  | { type: "error"; message: string };

/** Compact match data for the match cards in assistant answers. */
export type ChatMatchCardDTO = {
  id: string;
  teamSlug: string;
  teamName: string;
  enemyName: string;
  time: string;
  isHomeGame: boolean;
  type: "REGULAR" | "CUP";
  location: { hallName: string; streetAddress: string; city: string } | null;
  lineup: { id: string; fullName: string }[];
  availability: {
    available: number;
    unavailable: number;
    unknown: number;
    notResponded: number;
  };
};

/** Match card data in action previews; availability is null for new matches. */
export type ChatMatchCardData = Omit<ChatMatchCardDTO, "availability"> & {
  availability: ChatMatchCardDTO["availability"] | null;
};
