export function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export function logUse(): void {
  const currentURL = window.location.href;
  const hasLoggedUse = sessionStorage.getItem("hasLoggedUse");
  if (currentURL.includes("localhost") || hasLoggedUse) return;
  sessionStorage.setItem("hasLoggedUse", "true");

  fetch("https://note.henryk.co.za/api/log?site=snippet-manager")
    .then((res: Response) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}