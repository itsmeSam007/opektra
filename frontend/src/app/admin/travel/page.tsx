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
import type { TravelEntry } from "@/lib/api";

export default function AdminTravelPage() {
  const [items, setItems] = useState<TravelEntry[]>([]);
  const [editing, setEditing] = useState<Partial<TravelEntry> | null>(null);
  const [galleryJson, setGalleryJson] = useState("[]");

  const load = () => {
    adminFetch<TravelEntry[]>("/travel?published_only=false").then(setItems).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    try {
      const payload = {
        ...editing,
        gallery_images: JSON.parse(galleryJson || "[]"),
        visited_at: editing.visited_at || new Date().toISOString(),
      };
      if (editing.id) {
        await adminFetch(`/travel/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/travel", { method: "POST", body: JSON.stringify(payload) });
      }
      load();
      setEditing(null);
    } catch {
      alert("Save failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">Travel</h1>
        </div>
        <Button
          onClick={() => {
            setEditing({
              slug: "",
              title: "",
              location_name: "",
              category: "adventure",
              excerpt: "",
              content: "",
              is_published: true,
              is_featured: false,
              sort_order: 0,
            });
            setGalleryJson("[]");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.location_name}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(item);
                    setGalleryJson(JSON.stringify(item.gallery_images || [], null, 2));
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete?")) {
                      await adminFetch(`/travel/${item.id}`, { method: "DELETE" });
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
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <CardContent className="space-y-4 p-6">
              {(["slug", "title", "location_name", "category", "cover_image_url"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <Label>{f}</Label>
                  <Input
                    value={(editing[f] as string) || ""}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label>excerpt</Label>
                <Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>content</Label>
                <Textarea value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={4} />
              </div>
              <div className="space-y-1">
                <Label>Gallery JSON</Label>
                <Textarea value={galleryJson} onChange={(e) => setGalleryJson(e.target.value)} rows={4} />
              </div>
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
