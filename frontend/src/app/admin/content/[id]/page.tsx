"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface CMSPage {
  id: number;
  slug: string;
  title: string;
  status: string;
  seo: { meta_title?: string; meta_description?: string };
  blocks: { id?: number; type: string; order: number; data: Record<string, string> }[];
}

export default function AdminContentEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [page, setPage] = useState<Partial<CMSPage>>({
    slug: "",
    title: "",
    status: "draft",
    seo: {},
    blocks: [{ type: "rich_text", order: 0, data: { html: "" } }],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    import("@/lib/admin-api").then(({ adminFetch }) =>
      adminFetch<CMSPage>(`/cms/pages/id/${id}`).then(setPage).catch(() => {})
    );
  }, [id, isNew]);

  const save = async () => {
    setSaving(true);
    const { adminFetch } = await import("@/lib/admin-api");
    try {
      const body = {
        slug: page.slug,
        title: page.title,
        status: page.status,
        seo: page.seo,
        blocks: page.blocks,
      };
      if (isNew) {
        const created = await adminFetch<CMSPage>("/cms/pages", {
          method: "POST",
          body: JSON.stringify(body),
        });
        router.push(`/admin/content/${created.id}`);
      } else {
        await adminFetch(`/cms/pages/${id}`, { method: "PUT", body: JSON.stringify(body) });
      }
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    const { adminFetch } = await import("@/lib/admin-api");
    await adminFetch(`/cms/pages/${id}/publish`, { method: "POST", body: "{}" });
    setPage((p) => ({ ...p, status: "published" }));
  };

  const blockHtml = page.blocks?.[0]?.data?.html ?? "";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">{isNew ? "New Page" : "Edit Page"}</h1>
      </div>

      <Card className="mt-8">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={page.title || ""} onChange={(e) => setPage({ ...page, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input value={page.slug || ""} onChange={(e) => setPage({ ...page, slug: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Meta title</Label>
            <Input
              value={page.seo?.meta_title || ""}
              onChange={(e) => setPage({ ...page, seo: { ...page.seo, meta_title: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <Label>Content (HTML)</Label>
            <Textarea
              rows={10}
              value={blockHtml}
              onChange={(e) =>
                setPage({
                  ...page,
                  blocks: [{ type: "rich_text", order: 0, data: { html: e.target.value } }],
                })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save draft"}
            </Button>
            {!isNew && (
              <Button variant="outline" onClick={publish}>
                Publish
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
