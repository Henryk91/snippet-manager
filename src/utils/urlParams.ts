export function getParam(name: string, url = window.location.href) {
  const u = new URL(url);
  return u.searchParams.get(name) ?? "";
}

export function setParam(name: string, value: string) {
  const u = new URL(window.location.href);
  if (value) u.searchParams.set(name, value);
  else u.searchParams.delete(name);
  window.history.replaceState({}, "", u.toString());
}
