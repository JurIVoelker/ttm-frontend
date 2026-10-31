import { cn } from "@/lib/utils";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatMatchCards from "./chat-match-cards";

const components: Components = {
  p: ({ className, ...props }) => (
    <p className={cn("leading-relaxed [&:not(:first-child)]:mt-3", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("mt-2 ml-5 list-disc space-y-1", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("mt-2 ml-5 list-decimal space-y-1", className)} {...props} />
  ),
  h1: ({ className, ...props }) => (
    <h3 className={cn("mt-4 font-semibold first:mt-0", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h3 className={cn("mt-4 font-semibold first:mt-0", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-4 font-semibold first:mt-0", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("text-primary underline underline-offset-4", className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code className={cn("rounded bg-muted px-1 py-0.5 text-[0.85em]", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <div className="mt-3 overflow-x-auto rounded-md border">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("border-b bg-muted/50 px-3 py-2 text-left font-medium whitespace-nowrap", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border-b px-3 py-2 align-top [tr:last-child_&]:border-b-0", className)} {...props} />
  ),
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.value ?? (node.children ?? []).map(textOf).join("");

/** Match ids of a ```spiele block, or null for any other code block. */
const matchIdsOf = (pre: HastNode | undefined) => {
  const code = pre?.children?.find((c) => c.tagName === "code");
  const classes = code?.properties?.className;
  if (!code || !Array.isArray(classes) || !classes.includes("language-spiele")) return null;
  return textOf(code)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const ChatMarkdown = ({ text, streaming = false }: { text: string; streaming?: boolean }) => (
  <div className="text-sm break-words">
    {/* Raw HTML in model output is not rendered (react-markdown default) */}
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ...components,
        pre: ({ node, className, ...props }) => {
          const ids = matchIdsOf(node as HastNode | undefined);
          if (ids) return <ChatMatchCards ids={ids} streaming={streaming} />;
          return (
            <pre
              className={cn("mt-3 overflow-x-auto rounded-md bg-muted p-3 text-xs", className)}
              {...props}
            />
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  </div>
);

export default ChatMarkdown;
