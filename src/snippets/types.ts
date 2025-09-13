export type Snippet = {
  id: string;
  title: string;
  markdown: string;
  tags?: string[];
};

export type Section = {
  id: string;      // tab key (e.g., "bash")
  label: string;   // tab label (e.g., "Bash")
  snippets: Snippet[];
};
