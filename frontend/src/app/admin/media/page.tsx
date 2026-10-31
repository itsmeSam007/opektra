"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminFetch } from "@/lib/admin-api";

interface MediaAsset {
  id: number;
  filename: string;
  url: string;
  alt_text: string;
  caption: string | null;
  mime_type: string;
  size_bytes: number;
  folder: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [altText, setAltText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    adminFetch<MediaAsset[]>("/media").then(setAssets).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !altText.trim()) {
      alert("Select a file and provide alt text.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("alt_text", altText.trim());
    const token = (await import("@/lib/auth-session")).getAccessToken();
    const res = await fetch("/api/v1/media", {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      alert("Upload failed");
      return;
    }
    setAltText("");
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this asset?")) return;
    await adminFetch(`/media/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold">Media</h1>
      <p className="mt-1 text-muted-foreground">Upload images and documents. Alt text is required.</p>

      <Tabs defaultValue="library" className="mt-8">
        <TabsList>
          <TabsTrigger value="library">Media Library</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label>File</Label>
                <Input ref={fileRef} type="file" accept="image/*,application/pdf" />
              </div>
              <div>
                <Label>Alt text (required)</Label>
                <Input value={altText} onChange={(e) => setAltText(e.target.value)} />
              </div>
              <div className="sm:col-span-3">
                <Button onClick={upload}>Upload</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4">
                  {a.mime_type.startsWith("image/") ? (
                    <img src={a.url} alt={a.alt_text} className="mb-2 aspect-video w-full rounded object-cover" />
                  ) : (
                    <div className="mb-2 flex aspect-video items-center justify-center rounded bg-muted text-sm">
                      {a.mime_type}
                    </div>
                  )}
                  <p className="truncate text-sm font-medium">{a.alt_text}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.filename}</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(a.url)}>
                      Copy URL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(a.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
