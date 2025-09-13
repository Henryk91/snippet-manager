const ctx = (require as any).context("./markdown", true, /\.md$/);

export async function loadSectionsFromMd() {
  const entries = ctx.keys(); // ['./bash/find-files.md', './js/debounce.md', ...]
  // Fetch file contents
  const files = await Promise.all(entries.map(async (key : any) => {
    // For CRA, ctx(key) is a URL string to the asset
    const url: string = ctx(key).default ?? ctx(key);
    const res = await fetch(url);
    const text = await res.text();
    return { key, url, text };
  }));

  let responseObj: any = {}
  for (const f of files) {
    // key like './bash/find-files.md'
    const parts = f.key.replace(/^\.\//, "").split("/");
    const sectionId = parts.length > 1 ? parts[0] : "general";
    const filename = parts[parts.length - 1];

    const id = filename.replace(/\.md$/, "")
    if (!responseObj[sectionId]) {
        responseObj[sectionId] = {[id]: f.text}
    } else{
        responseObj[sectionId][id] = f.text as string
    }
  }
  return responseObj
}