import type { Section } from "../types";

const section: Section = {
    id: "js",
    label: "JavaScript",
    snippets: [
      {
        id: "js1",
        title: "Debounce",
        markdown: `
\`\`\`js
export function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
\`\`\`
`,
      },
      {
        id: "js2",
        title: "Fisher–Yates Shuffle",
        markdown: `
\`\`\`js
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
\`\`\`
`,
      },
    ],
  };

export default section;
