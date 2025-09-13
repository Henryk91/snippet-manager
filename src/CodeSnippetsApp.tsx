import React, { useEffect, useMemo, useRef, useState } from "react";
// import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import mermaid from "mermaid";
import "highlight.js/styles/monokai-sublime.css"; // Monokai Sublime theme

import sectionsFromDisk from "./snippets"; // <- auto-discovered

/**
 * Code Snippets App
 * - Dynamic tabs (languages/sections)
 * - Search filter (title + body)
 * - Responsive grid layout; cards grow to content
 * - Markdown with GFM + syntax highlight (Monokai)
 * - Mermaid diagrams inside fenced blocks ```mermaid
 * - Maximize per card (modal view)
 *
 * How to extend:
 * 1) Edit DATA below or fetch your own JSON and set state.
 * 2) To add a tab: add a Section object with id/label/snippets.
 * 3) To add a snippet: push to section.snippets with title + markdown.
 */

// -------------------- Types --------------------

type Snippet = {
  id: string;
  title: string;
  markdown: string;
  tags?: string[];
};

type Section = {
  id: string; // tab key
  label: string; // tab title
  snippets: Snippet[];
};

// -------------------- Demo DATA --------------------

// -------------------- Demo DATA --------------------

// const DATA: Section[] = [
//   {
//     id: "bash",
//     label: "Bash",
//     snippets: [
//       {
//         id: "b1",
//         title: "Find files by name",
//         markdown: `
// Quickly find files recursively:

// \`\`\`bash
// find . -type f -name "*.log" -not -path "*/node_modules/*"
// \`\`\`
// `,
//       },
//       {
//         id: "b2",
//         title: "cURL JSON POST",
//         markdown: `
// Send JSON via POST and pretty-print response:

// \`\`\`bash
// curl -s -X POST https://httpbin.org/post \\
//   -H 'Content-Type: application/json' \\
//   -d '{"hello":"world"}' | jq
// \`\`\`
// `,
//       },
//     ],
//   },
//   {
//     id: "js",
//     label: "JavaScript",
//     snippets: [
//       {
//         id: "js1",
//         title: "Debounce",
//         markdown: `
// \`\`\`js
// export function debounce(fn, delay = 250) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), delay);
//   };
// }
// \`\`\`
// `,
//       },
//       {
//         id: "js2",
//         title: "Fisher–Yates Shuffle",
//         markdown: `
// \`\`\`js
// export function shuffle(arr) {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }
// \`\`\`
// `,
//       },
//     ],
//   },
//   {
//     id: "diagrams",
//     label: "Diagrams",
//     snippets: [
//       {
//   id: "m1",
//   title: "Mermaid: Service Flow",
//   markdown: `
// You can embed Mermaid by using a fenced block with \`mermaid\`:

// \`\`\`mermaid
// flowchart LR
//   client[Browser] -->|HTTP| api(API)
//   api --> svc1(Service A)
//   api --> svc2(Service B)
//   svc1 --> db[(Postgres)]
//   svc2 --> cache[(Redis)]
// \`\`\`
// `,
//       },
//     ],
//   },
// ];


// -------------------- Utilities --------------------

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// at the top of your file:

// helpers: extract raw text from React nodes (handles nested spans/arrays)
// --- helpers ---
// 1) helper stays the same



// 4) Keep <code> renderer SIMPLE; only for inline or as child of normal <pre>
type CodeLikeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

// type CodeProps = {
//   inline?: boolean;
//   className?: string;
//   children?: React.ReactNode;
// } & React.HTMLAttributes<HTMLElement>;


// --- helpers: extract raw text from possibly nested React nodes
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) return extractText((node.props as any).children);
  return '';
}

type CodeRendererProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

type PreProps = React.ComponentProps<'pre'> & { children?: React.ReactNode };

// --- Mermaid renderer (shows fallback if empty or parse error)
const Mermaid: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const rid = React.useId();              // stable unique id for mermaid.render
  const mid = `mmd-${rid}`;

  React.useEffect(() => {
    let mounted = true;
    if (!chart?.trim()) return;

    // initialize once per mount; re-calling is safe but we guard anyway
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
      });
    } catch {/* no-op */}

    // clear any previous content (handles StrictMode / re-renders)
    if (ref.current) ref.current.innerHTML = '';

    (async () => {
      try {
        // Render to string (does NOT require the element to exist in DOM)
        const { svg } = await mermaid.render(mid, chart.trim());
        if (mounted && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        // If parsing fails, keep raw text visible for debugging
        if (mounted && ref.current) {
          ref.current.innerHTML =
            `<pre style="white-space:pre-wrap;opacity:.8">[Mermaid render failed]\n${chart}</pre>`;
        }
      }
    })();

    return () => { mounted = false; };
  }, [chart, mid]);

  return (
    <div
      ref={ref}
      className="rounded-lg border border-white/10 bg-black/40 p-2"
      style={{ width: '100%', overflow: 'auto', minHeight: 24 }}
    />
  );
};




// --- <pre> handler: route mermaid to <Mermaid>, otherwise keep normal <pre><code> ---
const PreBlock: React.FC<PreProps> = (props) => {
  const preClass = (props.className ?? '') as string;
  const kids = React.Children.toArray(props.children);
  const first = kids[0] as any;
  const childClass = (first?.props?.className ?? '') as string;
  const combinedClass = `${preClass} ${childClass}`.trim();

  const raw = extractText(props.children).trim();

  const isMermaidClass = /(^|\s)language-mermaid(\s|$)/.test(combinedClass);
  const looksLikeMermaid =
    /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|journey)\b/.test(raw);

  if (isMermaidClass || looksLikeMermaid) {
    return <Mermaid chart={raw} />;
  }

  return (
    <pre {...props} className={['hljs', preClass].filter(Boolean).join(' ')}>
      {props.children}
    </pre>
  );
};




// --- inline code passthrough (keeps highlight spans intact) ---
const CodeInline: React.FC<CodeRendererProps> = ({ inline, className, children, ...rest }) => (
  <code className={className} {...rest}>{children}</code>
);








// Render code blocks; if language is mermaid, render via mermaid
type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

function Markdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        pre: PreBlock,
        code: (({ inline, className, children, ...rest }: CodeProps) => (
          <code className={className} {...rest}>{children}</code>
        )) as React.FC<CodeProps>,
      }}
    />
  );
}




// utils (top of file)
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

// grab first fenced code block; fallback to whole markdown
function extractFirstFence(md: string): { code: string; lang?: string } {
  const m = md.match(/```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/);
  return m ? { lang: m[1] || '', code: m[2] || '' } : { code: md };
}

// -------------------- Snippet Card --------------------

function SnippetCard({ snippet, onMax }: { snippet: Snippet; onMax: (s: Snippet) => void }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const { code } = extractFirstFence(snippet.markdown);
    const ok = await copyToClipboard(code || snippet.markdown);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-4 pb-3 shadow-lg hover:border-white/20">
      <div className="text-sm font-medium text-white/80">{snippet.title}</div>

      {/* content area */}
      <div className="prose prose-invert  max-w-none">
        <Markdown markdown={snippet.markdown} />
        </div>

      {/* action bar (never overlays content) */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={handleCopy}
          className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
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

// -------------------- Modal --------------------

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-white/10 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function getParam(name: string, url = window.location.href) {
  const u = new URL(url);
  return u.searchParams.get(name) ?? '';
}
function setParam(name: string, value: string) {
  const u = new URL(window.location.href);
  if (value) u.searchParams.set(name, value);
  else u.searchParams.delete(name);
  window.history.replaceState({}, '', u.toString());
}
// -------------------- Tabs + Search + Grid --------------------

export default function CodeSnippetsApp() {
//   const [sections] = React.useState<Section[]>(DATA);
  const [sections] = React.useState<Section[]>(sectionsFromDisk);

  // Read initial tab from URL, fallback to first section
  const initialTab =
    (getParam('tab') && sections.find(s => s.id === getParam('tab'))?.id) ||
    sections[0]?.id ||
    '';
  const [active, setActive] = React.useState<string>(initialTab);

  const [q, setQ] = React.useState('');
  const [maxSnip, setMaxSnip] = React.useState<Snippet | null>(null);
  const [modalEpoch, setModalEpoch] = React.useState(0); // if you’re using this already

  // Update URL when tab changes (without reloading)
  React.useEffect(() => {
    if (!active) return;
    setParam('tab', active);
  }, [active]);

  // Handle browser back/forward: keep active tab in sync
  React.useEffect(() => {
    const onPop = () => {
      const tab = getParam('tab');
      if (tab && sections.some(s => s.id === tab)) {
        setActive(tab);
      } else if (sections[0]) {
        setActive(sections[0].id);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [sections]);

  const current = React.useMemo(
    () => sections.find((s) => s.id === active) ?? sections[0],
    [sections, active]
  );

  const filtered = React.useMemo(() => {
    if (!current) return [] as Snippet[];
    const query = q.trim().toLowerCase();
    if (!query) return current.snippets;
    return current.snippets.filter(
      (s) => s.title.toLowerCase().includes(query) || s.markdown.toLowerCase().includes(query)
    );
  }, [current, q]);

  React.useEffect(() => {
  const urlQ = getParam('q');
  if (urlQ) setQ(urlQ);
}, []);

// Update URL when q changes
React.useEffect(() => {
  const u = new URL(window.location.href);
  if (q.trim()) u.searchParams.set('q', q);
  else u.searchParams.delete('q');
  window.history.replaceState({}, '', u.toString());
}, [q]);


  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          {/* Tabs */}
          <nav className="flex flex-1 flex-wrap items-center gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                className={classNames(
                  "rounded-2xl px-3 py-1.5 text-sm",
                  active === s.id ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                )}
                onClick={() => setActive(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
          {/* Search */}
<div className="relative w-full min-w-[220px] flex-1 sm:w-auto sm:flex-none">
  <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search snippets…"
    className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 pr-8 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
  />
  {q && (
    <button
      type="button"
      onClick={() => setQ('')}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 hover:text-white/90 hover:bg-white/10"
      aria-label="Clear search"
    >
      ✕
    </button>
  )}
</div>

        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6">
        {filtered.length === 0 ? (
          <div className="text-white/60">No snippets match your search.</div>
        ) : (
            <div
                className="grid auto-rows-max gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
                >
            {filtered.map((snip) => (
              <SnippetCard key={snip.id} snippet={snip} onMax={(s) => setMaxSnip(s)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal for maximize */}
      <Modal open={!!maxSnip} onClose={() => setMaxSnip(null)}>
        {maxSnip && (
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold">{maxSnip.title}</div>
            <div className="prose prose-invert max-w-none">
              <Markdown markdown={maxSnip.markdown} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// -------------------- Tailwind (optional) --------------------
// If you use Create React App or Vite, add Tailwind and include the classes above.
// The component also works with plain CSS; replace classNames with your styles if needed.
