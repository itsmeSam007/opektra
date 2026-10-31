"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin-api";

interface SettingRow {
  key: string;
  value: string;
}

const SEO_KEYS = [
  "seo_site_url",
  "seo_title_suffix",
  "seo_default_description",
  "seo_og_image",
  "seo_twitter_handle",
  "seo_robots_txt",
  "seo_staging_noindex",
];

export default function AdminSeoPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<SettingRow[]>("/settings?group=seo")
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => {
          map[r.key] = r.value;
        });
        setValues(map);
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/settings", {
        method: "PUT",
        body: JSON.stringify({
          settings: SEO_KEYS.map((key) => ({ key, value: values[key] ?? "" })),
        }),
      });
      alert("SEO settings saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">SEO</h1>
      <p className="mt-1 text-muted-foreground">Global SEO defaults, robots.txt, and staging controls.</p>

      <Card className="mt-8">
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>Canonical site URL</Label>
            <Input
              value={values.seo_site_url ?? ""}
              onChange={(e) => setValues({ ...values, seo_site_url: e.target.value })}
            />
          </div>
          <div>
            <Label>Title suffix</Label>
            <Input
              value={values.seo_title_suffix ?? ""}
              onChange={(e) => setValues({ ...values, seo_title_suffix: e.target.value })}
            />
          </div>
          <div>
            <Label>Default meta description</Label>
            <Textarea
              value={values.seo_default_description ?? ""}
              onChange={(e) => setValues({ ...values, seo_default_description: e.target.value })}
            />
          </div>
          <div>
            <Label>Default OG image URL</Label>
            <Input
              value={values.seo_og_image ?? ""}
              onChange={(e) => setValues({ ...values, seo_og_image: e.target.value })}
            />
          </div>
          <div>
            <Label>Twitter handle</Label>
            <Input
              value={values.seo_twitter_handle ?? ""}
              onChange={(e) => setValues({ ...values, seo_twitter_handle: e.target.value })}
            />
          </div>
          <div>
            <Label>robots.txt</Label>
            <Textarea
              rows={6}
              value={values.seo_robots_txt ?? ""}
              onChange={(e) => setValues({ ...values, seo_robots_txt: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noindex"
              checked={(values.seo_staging_noindex ?? "false") === "true"}
              onChange={(e) =>
                setValues({ ...values, seo_staging_noindex: e.target.checked ? "true" : "false" })
              }
            />
            <Label htmlFor="noindex">Staging noindex override</Label>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save SEO Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
