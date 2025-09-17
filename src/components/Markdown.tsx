import mermaid from "mermaid";
import { Children, ComponentProps, FC, HTMLAttributes, ReactNode, useEffect, useId, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { extractText } from "../utils/extractText";
import "highlight.js/styles/monokai.css";

type PreProps = ComponentProps<"pre"> & { children?: ReactNode };

const Mermaid: FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rid = useId();
  const mid = `mmd-${rid}`;

  useEffect(() => {
    let mounted = true;
    if (!chart?.trim()) return;

    // initialize once per mount; re-calling is safe but we guard anyway
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
      });
    } catch {
      /* no-op */
    }

    // clear any previous content (handles StrictMode / re-renders)
    if (ref.current) ref.current.innerHTML = "";

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
          ref.current.innerHTML = `<pre style="white-space:pre-wrap;opacity:.8">[Mermaid render failed]\n${chart}</pre>`;
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [chart, mid]);

  return (
    <div
      ref={ref}
      className="rounded-lg border border-white/10 bg-black/40 p-2"
      style={{ width: "100%", overflow: "auto", minHeight: 24 }}
    />
  );
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

const PreBlock: FC<PreProps> = (props) => {
  const preClass = (props.className ?? "") as string;
  const kids = Children.toArray(props.children);
  const first = kids[0] as any;
  const childClass = (first?.props?.className ?? "") as string;
  const combinedClass = `${preClass} ${childClass}`.trim();

  const raw = extractText(props.children).trim();

  const isMermaidClass = /(^|\s)language-mermaid(\s|$)/.test(combinedClass);
  const looksLikeMermaid =
    /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|journey)\b/.test(raw);

  if (isMermaidClass || looksLikeMermaid) {
    return <Mermaid chart={raw} />;
  }

  return (
    <pre
      {...props}
      className={["hljs", preClass, "overflow-x-auto whitespace-pre rounded-lg p-2"].filter(Boolean).join(" ")}
    >
      {props.children}
    </pre>
  );
};

export function Markdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        pre: PreBlock,
        code: (({ inline, className, children, ...rest }: CodeProps) => (
          <code className={className} {...rest}>
            {children}
          </code>
        )) as FC<CodeProps>,
      }}
    />
  );
}
