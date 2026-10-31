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
import type { PortfolioItem } from "@/lib/api";

const emptyItem: Partial<PortfolioItem> = {
  slug: "",
  title: "",
  category: "",
  description: "",
  technologies: "",
  image_url: "",
  project_url: "",
  is_published: true,
  sort_order: 0,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<Partial<PortfolioItem> | null>(null);

  const load = () => {
    adminFetch<PortfolioItem[]>("/portfolio?published_only=false").then(setItems).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await adminFetch(`/portfolio/${editing.id}`, { method: "PUT", body: JSON.stringify(editing) });
      } else {
        await adminFetch("/portfolio", { method: "POST", body: JSON.stringify(editing) });
      }
      load();
      setEditing(null);
    } catch {
      alert("Save failed");
    }
  };

  const togglePublished = async (item: PortfolioItem) => {
    await adminFetch(`/portfolio/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_published: !item.is_published }),
    });
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">Portfolio</h1>
        </div>
        <Button onClick={() => setEditing({ ...emptyItem })}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <h3 className="font-medium">
                  {item.title}
                  {!item.is_published && <span className="ml-2 text-xs text-muted-foreground">(Draft)</span>}
                </h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => togglePublished(item)}>
                  {item.is_published ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(item)}>Edit</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete?")) {
                      await adminFetch(`/portfolio/${item.id}`, { method: "DELETE" });
                      setItems(items.filter((i) => i.id !== item.id));
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
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <CardContent className="space-y-4 p-6">
              {(["slug", "title", "category", "technologies", "image_url", "project_url"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <Label>{f}</Label>
                  <Input
                    value={(editing[f] as string) || ""}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
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
