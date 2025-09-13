import type { Section } from "../types";

const section: Section = {
    id: "bash",
    label: "Bash",
    snippets: [
      {
        id: "b1",
        title: "Find files by name",
        markdown: `
Quickly find files recursively:

\`\`\`bash
find . -type f -name "*.log" -not -path "*/node_modules/*"
\`\`\`
`,
      },
      {
        id: "b2",
        title: "cURL JSON POST",
        markdown: `
Send JSON via POST and pretty-print response:

\`\`\`bash
curl -s -X POST https://httpbin.org/post \\
  -H 'Content-Type: application/json' \\
  -d '{"hello":"world"}' | jq
\`\`\`
`,
      },
    ],
  };

export default section;
