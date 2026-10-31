import { ChatConversationSummary } from "@/types/chat";
import { useFetchData } from "./use-fetch";

export const useFetchChatConversations = (ready = true) => {
  const result = useFetchData<{ conversations: ChatConversationSummary[] }>({
    method: "GET",
    path: `/api/chat/conversations`,
    queryKey: "chat-conversations",
    ready,
  });

  return result;
};
