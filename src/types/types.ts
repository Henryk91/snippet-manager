export type Snippet = {
  id: string;
  title: string;
  markdown: string;
  tags?: string[];
};

export type Section = {
  id: string;
  label: string;
  snippets: Snippet[];
};
