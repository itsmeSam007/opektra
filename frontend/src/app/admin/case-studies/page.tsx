"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";
import type { CaseStudy } from "@/lib/api";

const emptyStudy: Partial<CaseStudy> = {
  slug: "",
  title: "",
  client: "",
  industry: "",
  summary: "",
  challenge: "",
  solution: "",
  results: "",
  metrics: [],
  cover_image: "",
  related_product_slug: "",
  gallery_images: [],
  is_published: true,
  sort_order: 0,
};

export default function AdminCaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [editing, setEditing] = useState<Partial<CaseStudy> | null>(null);
  const [galleryJson, setGalleryJson] = useState("[]");

  const load = () => {
    adminFetch<CaseStudy[]>("/case-studies?published_only=false").then(setItems).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (study: CaseStudy) => {
    setEditing(study);
    setGalleryJson(JSON.stringify(study.gallery_images || [], null, 2));
  };

  const save = async () => {
    if (!editing) return;
    try {
      const payload = {
        ...editing,
        gallery_images: JSON.parse(galleryJson || "[]"),
      };
      if (editing.id) {
        await adminFetch(`/case-studies/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/case-studies", { method: "POST", body: JSON.stringify(payload) });
      }
      load();
      setEditing(null);
    } catch {
      alert("Save failed — check gallery JSON format.");
    }
  };

  const togglePublished = async (study: CaseStudy) => {
    await adminFetch(`/case-studies/${study.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_published: !study.is_published }),
    });
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">Case Studies</h1>
        </div>
        <Button
          onClick={() => {
            setEditing({ ...emptyStudy });
            setGalleryJson("[]");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {items.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <h3 className="font-medium">
                  {c.title}
                  {!c.is_published && <span className="ml-2 text-xs text-muted-foreground">(Draft)</span>}
                </h3>
                <p className="text-sm text-muted-foreground">{c.client}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => togglePublished(c)}>
                  {c.is_published ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(c)}>Edit</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete?")) {
                      await adminFetch(`/case-studies/${c.id}`, { method: "DELETE" });
                      setItems(items.filter((i) => i.id !== c.id));
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} Case Study</h2>
              {(["slug", "title", "client", "industry", "cover_image", "related_product_slug"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <Label>{f}</Label>
                  <Input
                    value={(editing[f] as string) || ""}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                  />
                </div>
              ))}
              {(["summary", "challenge", "solution", "results"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <Label>{f}</Label>
                  <Textarea
                    value={(editing[f] as string) || ""}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                    rows={3}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Gallery images JSON (url + alt)</Label>
                <Textarea value={galleryJson} onChange={(e) => setGalleryJson(e.target.value)} rows={5} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_published ?? true}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                />
                Published
              </label>
              <div className="flex gap-2">
                <Button onClick={save}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
