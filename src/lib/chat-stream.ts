import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { ChatEvent } from "@/types/chat";

/**
 * POSTs to a chat endpoint and calls `onEvent` for every server-sent event.
 * EventSource can't POST or send the Authorization header, so the SSE stream
 * is read from the fetch body. Resolves when the stream ends.
 */
export const streamChat = async ({
  path,
  body,
  onEvent,
}: {
  path: string;
  body: object;
  onEvent: (event: ChatEvent) => void;
}) => {
  const response = await sendRequest({
    method: "POST",
    path,
    body,
    options: { hideMessages: true, headers: { Accept: "text/event-stream" } },
  });

  if (!response.ok || !response.body) {
    const json = await response.json().catch(() => null);
    const message =
      json?.message ??
      (response.status === 429
        ? "Zu viele Anfragen in kurzer Zeit. Bitte warte einen Moment."
        : `Ein Fehler ist aufgetreten (${response.status}).`);
    showMessage(message, { variant: "error" });
    onEvent({ type: "error", message });
    onEvent({ type: "done", awaitingConfirmation: false });
    return;
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let receivedDone = false;

  const handleBlock = (block: string) => {
    // Lines starting with ":" are keep-alive comments
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return;
    try {
      const event = JSON.parse(data) as ChatEvent;
      if (event.type === "done") receivedDone = true;
      onEvent(event);
    } catch {
      console.error("Could not parse chat event", data);
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let separator: number;
      while ((separator = buffer.indexOf("\n\n")) !== -1) {
        handleBlock(buffer.slice(0, separator));
        buffer = buffer.slice(separator + 2);
      }
    }
    if (buffer.trim()) handleBlock(buffer);
  } catch (error) {
    console.error("Chat stream interrupted", error);
  }

  if (!receivedDone) {
    const message = "Die Verbindung wurde unterbrochen.";
    onEvent({ type: "error", message });
    onEvent({ type: "done", awaitingConfirmation: false });
  }
};
