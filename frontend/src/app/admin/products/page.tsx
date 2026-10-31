"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";
import type { Product } from "@/lib/api";

const emptyProduct: Partial<Product> = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  features: [],
  domains: [],
  architecture: { layers: [] },
  screenshots: [],
  is_flagship: false,
  is_published: true,
  sort_order: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = () => {
    adminFetch<Product[]>("/products?published_only=false").then(setProducts).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await adminFetch(`/products/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(editing),
        });
      } else {
        await adminFetch("/products", {
          method: "POST",
          body: JSON.stringify(editing),
        });
      }
      load();
      setEditing(null);
    } catch {
      alert("Save failed — check slug uniqueness and required fields.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await adminFetch(`/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const setFlagship = async (id: number) => {
    await adminFetch(`/products/${id}/flagship`, { method: "PATCH" });
    load();
  };

  const togglePublished = async (product: Product) => {
    await adminFetch(`/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_published: !product.is_published }),
    });
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Button onClick={() => setEditing({ ...emptyProduct })}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <h3 className="font-medium">
                  {p.name}{" "}
                  {p.is_flagship && <span className="text-xs text-accent">(Flagship)</span>}
                  {!p.is_published && <span className="text-xs text-muted-foreground">(Draft)</span>}
                </h3>
                <p className="text-sm text-muted-foreground">{p.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => togglePublished(p)}>
                  {p.is_published ? "Unpublish" : "Publish"}
                </Button>
                {!p.is_flagship && (
                  <Button variant="outline" size="sm" onClick={() => setFlagship(p.id)}>
                    <Star className="mr-1 h-3.5 w-3.5" /> Set flagship
                  </Button>
                )}
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
              <h2 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} Product</h2>
              {(["slug", "name", "tagline"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <Label>{field}</Label>
                  <Input
                    value={(editing[field] as string) || ""}
                    onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_published ?? true}
                    onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_flagship ?? false}
                    onChange={(e) => setEditing({ ...editing, is_flagship: e.target.checked })}
                  />
                  Flagship
                </label>
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
