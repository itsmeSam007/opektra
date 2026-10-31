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
import type { BlogPost } from "@/lib/api";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    adminFetch<BlogPost[]>("/blog?published_only=false").then(setPosts).catch(() => {});
  }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await adminFetch(`/blog/${editing.id}`, { method: "PUT", body: JSON.stringify(editing) });
      } else {
        await adminFetch("/blog", { method: "POST", body: JSON.stringify(editing) });
      }
      setPosts(await adminFetch<BlogPost[]>("/blog?published_only=false"));
      setEditing(null);
    } catch { alert("Save failed"); }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete?")) return;
    await adminFetch(`/blog/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
        </div>
        <Button onClick={() => setEditing({ slug: "", title: "", excerpt: "", content: "", is_published: false })}>
          <Plus className="mr-2 h-4 w-4" /> Add Post
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {posts.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.is_published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(p)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} Post</h2>
              {(["slug", "title", "tags"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <Label>{f}</Label>
                  <Input value={(editing[f] as string) || ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} />
                </div>
              ))}
              <div className="space-y-1"><Label>Excerpt</Label><Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
              <div className="space-y-1"><Label>Content (HTML)</Label><Textarea value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
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
