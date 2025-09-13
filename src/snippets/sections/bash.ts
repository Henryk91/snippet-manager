import { RawSection } from "../../types/types";

const section: RawSection = {
  id: "bash",
  label: "Bash",
  identifier: "bash",
  snippets: [
    {
      title: "Find files by name",
      description: "Quickly find files recursively:",
      markdown: `find . -type f -name "*.log" -not -path "*/node_modules/*"`,
    },
    {
      title: "cURL JSON POST",
      description: "Send JSON via POST and pretty-print response:",
      markdown: `curl -s -X POST https://httpbin.org/post \\
  -H 'Content-Type: application/json' \\
  -d '{"hello":"world"}' | jq
`,
    },
  ],
};

export default section;
