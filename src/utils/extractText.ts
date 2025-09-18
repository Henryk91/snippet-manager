import React, { JSX, ReactNode } from "react";

export function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) return extractText((node.props as any).children);
  return "";
}

export function extractFirstFence(md: string): { code: string; lang?: string } {
  const m = md.match(/```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/);
  return m ? { lang: m[1] || "", code: m[2] || "" } : { code: md };
}

export const hasLang = (className: string | undefined, ...langs: string[]) => {
  const set = new Set((className || "").split(/\s+/));
  return langs.some(l => set.has(l) || set.has(`language-${l}`));
};

export function colorizeCliToNodes(
  children: ReactNode,
  spanElement: (key: string, className: string, value: string) => JSX.Element
): React.ReactNode {
  const src = extractText(children);
  
  const lines = src.split(/\r?\n/);
  const out: React.ReactNode[] = [];

  // per-block monotonic key generator
  let keySeq = 0;
  const k = (tag: string) => `${tag}-${keySeq++}`;

  lines.forEach((line, li) => {
    if (li) out.push("\n");

    if (!line.trim()) {
      out.push("");
      return;
    }

    // prompt
    let rest = line;
    const mPrompt = rest.match(/^\s*([#$] )/);
    if (mPrompt) {
      out.push(spanElement(k("prompt"), "hljs-meta", mPrompt[1]));
      rest = rest.slice(mPrompt[0].length);
    }

    // head: command + optional subcommand
    const head = rest.match(/^([a-zA-Z0-9:_-]+)(\s+)([a-zA-Z0-9:_-]+)?/);
    let pos = 0;
    if (head) {
      out.push(
        spanElement(k("cmd"), "hljs-built_in", head[1]),
        head[2],
        head[3] ? spanElement(k("sub"), "hljs-keyword", head[3]) : null
      );
      pos = head[0].length;
    }

    // sticky regex helpers
    const pushPlainTill = (end: number) => {
      if (end > pos) {
        out.push(rest.slice(pos, end));
        pos = end;
      }
    };

    const patterns: Array<[RegExp, (m: RegExpExecArray) => React.ReactNode[]]> = [
      // line continuation "\" at EOL
      [/\\\s*$/y, (m) => [spanElement(k("cont"), "hljs-meta", "\\"), m[0].slice(1)]],
      // double-quoted strings
      [/"([^"\\]|\\.)*"/y, (m) => [spanElement(k("dq"), "hljs-string", m[0])]],
      // single-quoted strings
      [/'([^'\\]|\\.)*'/y, (m) => [spanElement(k("sq"), "hljs-string", m[0])]],
      // raw URLs
      [/(https?:\/\/\S+)/y, (m) => [spanElement(k("url"), "hljs-link", m[1])]],
      // placeholders <pod>
      [/&lt;[^&\n]+?&gt;|<[^>\n]+?>/y, (m) => [spanElement(k("ph"), "hljs-string", m[0])]],
      // $VARS (keep leading char/space outside)
      [/(^|[\s(])\$[A-Z_][A-Z0-9_]*/y, (m) => [m[1], spanElement(k("var"), "hljs-variable", m[0].slice(m[1].length))]],
      // KEY=VALUE
      [
        /\b([A-Z_][A-Z0-9_]*)=([^\s"']+)/y,
        (m) => [spanElement(k("key"), "hljs-attr", m[1]), "=", spanElement(k("val"), "hljs-string", m[2])],
      ],
      // --long-flags
      [/(^|\s)(--[a-z0-9-]+)/y, (m) => [m[1], spanElement(k("lflag"), "hljs-attr", m[2])]],

      // -single or long single-dash flags (-s, -type, -not, -path)
      [/(^|\s)(-[A-Za-z0-9][A-Za-z0-9-]*)/y, (m) => [m[1], spanElement(k("sflag"), "hljs-attr", m[2])]],
      // pipeline: | jq   → color "jq" as built_in
      [
        /\|\s*([A-Za-z0-9:_-]+)/y,
        (m) => {
          const lead = m[0].slice(0, m[0].length - m[1].length); // includes "| "
          return [lead, spanElement(k("pipecmd"), "hljs-built_in", m[1])];
        },
      ],

      // trailing comments
      [/(\s#.*)$/y, (m) => [spanElement(k("cmt"), "hljs-comment", m[1])]],
    ];

    while (pos < rest.length) {
      let matched = false;

      for (const [re, render] of patterns) {
        re.lastIndex = pos;
        const m = re.exec(rest);
        if (m && m.index === pos) {
          pushPlainTill(m.index);
          out.push(...render(m));
          pos = re.lastIndex;
          matched = true;
          break;
        }
      }

      if (!matched) {
        out.push(rest[pos]);
        pos += 1;
      }
    }
  });

  return out;
}
