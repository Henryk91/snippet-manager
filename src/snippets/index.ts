import type { Section, Snippet } from "../types/types";

// Only load files from ./sections (so we don't include index.ts)
const ctx = (require as any).context("./sections", false, /\.ts$/);

const sections: Section[] = ctx.keys()
  .map((key: string) => {
    const mod = ctx(key);
    if(mod.default){
      mod.default.snippets.map((s: Snippet, i: number) => {
        s.id = `${mod.default.id}${i}`
        if(mod.default.identifier){
          // eslint-disable-next-line
          s.markdown = `${"\`\`\`"}${mod.default.identifier}${s.markdown}${"\`\`\`"}`
        }
        return s
      })
    }
    return (mod.default ?? mod) as Section;
  })
  .filter((s: Section) => s && s.id && s.label && Array.isArray(s.snippets))
  .sort((a: Section, b: Section) => a.label.localeCompare(b.label));

export default sections;
