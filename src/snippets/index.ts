import type { Section, Snippet } from "../types/types";

// Only load files from ./sections (so we don't include index.ts)
const ctx = (require as any).context("./sections", false, /\.ts$/);

function normalizeMarkdown(md: string, identifier: string): string {
  const newLine = md.startsWith("\n")? "": "\n"
  // eslint-disable-next-line
  const ret = `${"\`\`\`"}${identifier}${newLine}${md}`
    .replace(/\r\n/g, "\n") // unify line endings
    .trim();
  return ret
}

const sections: Section[] = ctx.keys()
  .map((key: string) => {
    const mod = ctx(key);
    if(mod.default){
      mod.default.snippets.map((s: Snippet, i: number) => {
        s.id = `${mod.default.id}${i}`
        if(mod.default.identifier){
          s.markdown = normalizeMarkdown(s.markdown, mod.default.identifier)
        }
        return s
      })
    }
    return (mod.default ?? mod) as Section;
  })
  .filter((s: Section) => s && s.id && s.label && Array.isArray(s.snippets))
  .sort((a: Section, b: Section) => a.label.localeCompare(b.label));

export default sections;
