import { useEffect, useMemo, useState } from "react";
import "highlight.js/styles/monokai-sublime.css";

import sectionsFromDisk from "../snippets";
import { Section, Snippet } from "../types/types";
import { Markdown } from "./Markdown";
import { Modal } from "./Modal";
import SnippetCard from "./SnippetCard";
import { getParam, setParam } from "../utils/urlParams";
import { classNames, logUse } from "../utils/utils";

export default function CodeSnippetsApp() {
  const [sections] = useState<Section[]>(sectionsFromDisk);

  const initialTab = (getParam("tab") && sections.find((s) => s.id === getParam("tab"))?.id) || sections[0]?.id || "";
  const [active, setActive] = useState<string>(initialTab);

  const [q, setQ] = useState("");
  const [maxSnip, setMaxSnip] = useState<Snippet | null>(null);

  useEffect(() => {
    if (!active) return;
    setParam("tab", active);
  }, [active]);

  useEffect(() => {
    const onPop = () => {
      const tab = getParam("tab");
      if (tab && sections.some((s) => s.id === tab)) {
        setActive(tab);
      } else if (sections[0]) {
        setActive(sections[0].id);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [sections]);

  const current = useMemo(() => sections.find((s) => s.id === active) ?? sections[0], [sections, active]);

  const filtered = useMemo(() => {
    if (!current) return [] as Snippet[];
    const query = q.trim().toLowerCase();
    if (!query) return current.snippets;
    return current.snippets.filter(
      (s) => s.title.toLowerCase().includes(query) || s.markdown.toLowerCase().includes(query) || s.description?.toLowerCase().includes(query)
    );
  }, [current, q]);

  useEffect(() => {
    logUse();
    const urlQ = getParam("q");
    if (urlQ) setQ(urlQ);
  }, []);

  // Update URL when q changes
  useEffect(() => {
    const u = new URL(window.location.href);
    if (q.trim()) u.searchParams.set("q", q);
    else u.searchParams.delete("q");
    window.history.replaceState({}, "", u.toString());
  }, [q]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex flex-col md:flex-row max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          {/* Tabs */}
          <nav className="flex flex-1 flex-wrap items-center gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                className={classNames(
                  "rounded-2xl px-3 py-1.5 text-sm",
                  active === s.id ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                )}
                onClick={() => setActive(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
          {/* Search */}
          <div className="relative w-full min-w-[220px] flex-1 sm:w-auto sm:flex-none">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search snippets…"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 pr-8 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 hover:text-white/90 hover:bg-white/10"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6">
        {filtered.length === 0 ? (
          <div className="text-white/60">No snippets match your search.</div>
        ) : (
          <div
            className="grid auto-rows-max gap-2 sm:gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
          >
            {filtered.map((snip) => (
              <SnippetCard key={snip.id} snippet={snip} onMax={(s) => setMaxSnip(s)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal for maximize */}
      <Modal open={!!maxSnip} onClose={() => setMaxSnip(null)}>
        {maxSnip && (
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold">{maxSnip.title}</div>
            {maxSnip.description && (<div className="prose prose-invert max-w-none">{maxSnip.description}</div>)}
            <div className="prose prose-invert max-w-none">
              <Markdown markdown={maxSnip.markdown} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
