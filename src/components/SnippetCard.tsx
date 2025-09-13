import { useState } from "react";
import { Markdown } from "./Markdown";
import { Snippet } from "../snippets/types";
import { copyToClipboard } from "../utils/utils";
import { extractFirstFence } from "../utils/extractText";

export default function SnippetCard({ snippet, onMax }: { snippet: Snippet; onMax: (s: Snippet) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const { code } = extractFirstFence(snippet.markdown);
    const ok = await copyToClipboard(code || snippet.markdown);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-4 pb-3 shadow-lg hover:border-white/20">
      <div className="text-sm font-medium text-white/80">{snippet.title}</div>
      <div className="prose prose-invert  max-w-none">
        <Markdown markdown={snippet.markdown} />
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={handleCopy}
          className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={() => onMax(snippet)}
          className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
          aria-label="Maximize"
        >
          Maximize
        </button>
      </div>
    </div>
  );
}
