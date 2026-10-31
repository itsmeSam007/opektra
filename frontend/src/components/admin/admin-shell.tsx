"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import { ADMIN_NAV, canAccess } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

const PUBLIC_PATHS = ["/admin/login"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return <>{children}</>;
  }

  const perms = user?.permissions ?? [];
  const visibleNav = ADMIN_NAV.filter((item) => canAccess(perms, item.permission));

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 md:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <Link href="/admin/dashboard" className="mb-6 px-2 text-lg font-bold">
            FounderOS
          </Link>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {visibleNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "bg-accent/15 font-medium text-accent" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t pt-4">
            <p className="truncate px-2 text-xs text-muted-foreground">{user?.email}</p>
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
