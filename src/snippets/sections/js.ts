import type { RawSection } from "../../types/types";

const section: RawSection = {
  id: "js",
  label: "JavaScript",
  identifier: "js",
  snippets: [
    {
      title: "Debounce",
      markdown: `
export function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
`,
    },
    {
      title: "Fisher-Yates Shuffle",
      markdown: `
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
`,
    },
  ],
};

export default section;
