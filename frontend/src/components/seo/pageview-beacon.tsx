"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function visitorHash(): string {
  if (typeof window === "undefined") return "";
  const key = "fos_visitor";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function PageviewBeacon() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    fetch("/api/v1/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "page_view",
        path: pathname,
        visitor_hash: visitorHash(),
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
