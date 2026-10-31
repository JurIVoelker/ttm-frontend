import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp02Icon } from "hugeicons-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

const MAX_HEIGHT = 200;

const ChatInput = ({
  disabled,
  placeholder,
  onSend,
}: {
  disabled: boolean;
  placeholder: string;
  onSend: (text: string) => void;
}) => {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Grow with the content up to MAX_HEIGHT
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [text]);

  const submit = () => {
    if (disabled || !text.trim()) return;
    onSend(text);
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds a line break (not while composing, e.g. IME)
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-xl border bg-background p-2 shadow-sm dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
      )}
    >
      <textarea
        ref={ref}
        rows={1}
        value={text}
        maxLength={20000}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Nachricht an den Assistenten"
        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-base md:text-sm outline-none placeholder:text-muted-foreground"
      />
      <Button
        size="icon"
        onClick={submit}
        disabled={disabled || !text.trim()}
        aria-label="Senden"
      >
        <ArrowUp02Icon strokeWidth={2} />
      </Button>
    </div>
  );
};

export default ChatInput;
