"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import { CONTENT_MODULES, canAccess } from "@/lib/admin-nav";
import { adminFetch } from "@/lib/admin-api";

interface CMSPageSummary {
  id: number;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
}

export default function AdminContentPage() {
  const { user } = useAdminAuth();
  const perms = user?.permissions ?? [];
  const [pages, setPages] = useState<CMSPageSummary[]>([]);

  useEffect(() => {
    adminFetch<CMSPageSummary[]>("/cms/pages").then(setPages).catch(() => {});
  }, []);

  const modules = CONTENT_MODULES.filter((m) => canAccess(perms, m.permission));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content</h1>
        <Button asChild>
          <Link href="/admin/content/new">
            <Plus className="mr-2 h-4 w-4" /> New CMS Page
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="transition-colors hover:border-accent/50">
              <CardContent className="p-4">
                <h3 className="font-medium">{mod.label}</h3>
                <p className="text-sm text-muted-foreground">Manage {mod.label.toLowerCase()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-semibold">CMS Pages</h2>
      <div className="mt-4 space-y-3">
        {pages.map((page) => (
          <Link key={page.id} href={`/admin/content/${page.id}`}>
            <Card className="transition-colors hover:border-accent/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{page.status}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
