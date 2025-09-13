import { useState } from "react";
import { Markdown } from "./Markdown";
import { Snippet } from "../types/types";
import { copyToClipboard } from "../utils/utils";
import { extractFirstFence } from "../utils/extractText";

export default function SnippetCard({ snippet, onMax }: { snippet: Snippet; onMax: (s: Snippet) => void }) {
  const [copied, setCopied] = useState(false);
  // Todo: Make compact toggleable
  const compact = true;

  const handleCopy = async () => {
    const { code } = extractFirstFence(snippet.markdown);
    const ok = await copyToClipboard(code || snippet.markdown);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 900);
  };

  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-white/10 bg-zinc-900/70 p-3 shadow-sm hover:border-white/20">
      <div className="text-xs font-medium text-white/80 truncate">{snippet.title}</div>
      {snippet.description && (<div className="prose prose-invert prose-tight max-w-none text-[12px] -mb-1">{snippet.description}</div>)}
      <div
        className={compact ? "prose prose-invert prose-tight max-w-none text-[12px]" : "prose prose-invert max-w-none"}
      >
        <Markdown markdown={snippet.markdown} />
      </div>
      <div className="mt-1 flex items-center justify-end gap-1.5">
        <button
          onClick={handleCopy}
          className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[11px] text-white hover:bg-white/20"
          aria-label="Copy code"
          title="Copy"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => onMax(snippet)}
          className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[11px] text-white hover:bg-white/20"
          aria-label="Maximize"
          title="Maximize"
        >
          Maximize
        </button>
      </div>
    </div>
  );
}
