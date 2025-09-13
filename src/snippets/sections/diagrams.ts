import type { RawSection } from "../../types/types";

const section: RawSection = {
  id: "diagrams",
  label: "Diagrams",
  identifier: "mermaid",
  snippets: [
    {
      title: "Mermaid: Service Flow",
      description: "You can embed Mermaid by using a fenced block with `mermaid`:",
      markdown: `
flowchart LR
  client[Browser] -->|HTTP| api(API)
  api --> svc1(Service A)
  api --> svc2(Service B)
  svc1 --> db[(Postgres)]
  svc2 --> cache[(Redis)]
`,
    },
  ],
};

export default section;
