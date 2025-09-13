import type { Section } from "../types";

const section: Section = {
    id: "diagrams",
    label: "Diagrams",
    snippets: [
      {
  id: "m1",
  title: "Mermaid: Service Flow",
  markdown: `
You can embed Mermaid by using a fenced block with \`mermaid\`:

\`\`\`mermaid
flowchart LR
  client[Browser] -->|HTTP| api(API)
  api --> svc1(Service A)
  api --> svc2(Service B)
  svc1 --> db[(Postgres)]
  svc2 --> cache[(Redis)]
\`\`\`
`,
      },
    ],
  };

export default section;
