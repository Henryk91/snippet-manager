export type RawSnippet = {
  title: string;
  markdown: string;
  description?: string;
  identifier?: string
  tags?: string[];
};

export type Snippet = RawSnippet & {
  id: string;
};

export type RawSection = {
  id: string; // tab key (e.g., "bash")
  label: string; // tab label (e.g., "Bash")
  identifier?: string
  snippets: RawSnippet[];
};

export type Section = Omit<RawSection, "snippets"> & {
  snippets: Snippet[];
};
