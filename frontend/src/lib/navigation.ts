/** Highlight a section on its child pages without matching similarly prefixed routes. */
export function routeCurrent(pathname: string, href: string): "page" | "location" | undefined {
  if (pathname === href) return "page";
  return href !== "/" && pathname.startsWith(`${href}/`) ? "location" : undefined;
}
