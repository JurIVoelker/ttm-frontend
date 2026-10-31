import { Button } from "@/components/ui/button";
import { chatAnswerToText, matchIdsInAnswer } from "@/lib/chat-text";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { queryClient } from "@/lib/query";
import { ChatMatchCardDTO } from "@/types/chat";
import { Copy01Icon, Tick01Icon } from "hugeicons-react";
import { useState } from "react";

/** Same cache entry as the match cards (see ChatMatchCards). */
const loadMatches = (ids: string[]) =>
  queryClient.fetchQuery({
    queryKey: [`chat-matches-${ids.join(",")}`],
    staleTime: 60_000,
    queryFn: async () => {
      const response = await sendRequest({ method: "POST", path: "/api/chat/matches", body: { ids } });
      if (!response.ok) throw new Error(`Could not load matches (${response.status})`);
      return (await response.json()) as { matches: ChatMatchCardDTO[] };
    },
  });

const buildText = async (markdown: string) => {
  const blocks = matchIdsInAnswer(markdown);
  const results = await Promise.all(blocks.map(loadMatches));
  const matchesById = new Map(results.flatMap((r) => r.matches.map((m) => [m.id, m] as const)));
  return chatAnswerToText(markdown, matchesById);
};

const writeToClipboard = async (text: Promise<string>) => {
  // Safari only allows clipboard writes within the click; a ClipboardItem with
  // a pending value keeps that permission while the match data loads.
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    await navigator.clipboard.write([
      new ClipboardItem({ "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })) }),
    ]);
    return;
  }
  await navigator.clipboard.writeText(await text);
};

const ChatCopyButton = ({ markdown }: { markdown: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await writeToClipboard(buildText(markdown));
      setCopied(true);
      showMessage("Antwort als Text kopiert");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
      showMessage("Kopieren fehlgeschlagen", { variant: "error" });
    }
  };

  return (
    <Button
      variant="ghost-muted"
      size="sm"
      onClick={onCopy}
      aria-label="Antwort als Text kopieren"
      className="h-7 px-2 text-xs"
    >
      {copied ? <Tick01Icon strokeWidth={2} /> : <Copy01Icon strokeWidth={2} />}
      Kopieren
    </Button>
  );
};

export default ChatCopyButton;
