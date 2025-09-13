import React, { ReactNode } from "react";

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
