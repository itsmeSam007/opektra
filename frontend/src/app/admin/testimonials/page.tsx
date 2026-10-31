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
import type { Testimonial } from "@/lib/api";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  useEffect(() => {
    adminFetch<Testimonial[]>("/testimonials?published_only=false").then(setItems).catch(() => {});
  }, []);

  const save = async () => {
    if (!editing) return;
    if (editing.id) {
      await adminFetch(`/testimonials/${editing.id}`, { method: "PUT", body: JSON.stringify(editing) });
    } else {
      await adminFetch("/testimonials", { method: "POST", body: JSON.stringify(editing) });
    }
    setItems(await adminFetch<Testimonial[]>("/testimonials?published_only=false"));
    setEditing(null);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete?")) return;
    await adminFetch(`/testimonials/${id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">Testimonials</h1>
        </div>
        <Button onClick={() => setEditing({ name: "", role: "", company: "", content: "" })}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {items.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}, {t.company}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(t)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <Card className="w-full max-w-lg">
            <CardContent className="space-y-4 p-6">
              {(["name", "role", "company"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <Label>{f}</Label>
                  <Input value={(editing[f] as string) || ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} />
                </div>
              ))}
              <div className="space-y-1"><Label>Content</Label><Textarea value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={4} /></div>
              <div className="flex gap-2"><Button onClick={save}>Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
