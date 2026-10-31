"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminFetch } from "@/lib/admin-api";

interface SettingRow {
  key: string;
  value: string;
  is_secret?: boolean;
}

const BRANDING_KEYS = ["site_title", "site_description", "founder_name", "founder_title", "primary_color"];
const GENERAL_KEYS = ["contact_email", "linkedin_url", "twitter_url", "github_url", "module_travel_enabled", "module_media_enabled"];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<SettingRow[]>("/settings")
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => {
          map[r.key] = r.value;
        });
        setValues(map);
      })
      .catch(() => {});
  }, []);

  const saveKeys = async (keys: string[]) => {
    setSaving(true);
    try {
      await adminFetch("/settings", {
        method: "PUT",
        body: JSON.stringify({
          settings: keys.map((key) => ({ key, value: values[key] ?? "" })),
        }),
      });
      alert("Settings saved.");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: string, label: string, type = "text") => (
    <div key={key}>
      <Label>{label}</Label>
      <Input
        type={type}
        value={values[key] ?? ""}
        onChange={(e) => setValues({ ...values, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Branding, modules, and site configuration.</p>

      <Tabs defaultValue="general" className="mt-8">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="space-y-4 p-6">
              {field("contact_email", "Contact email", "email")}
              {field("linkedin_url", "LinkedIn URL")}
              {field("twitter_url", "Twitter URL")}
              {field("github_url", "GitHub URL")}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(values.module_travel_enabled ?? "true") === "true"}
                  onChange={(e) =>
                    setValues({ ...values, module_travel_enabled: e.target.checked ? "true" : "false" })
                  }
                />
                <Label>Travel module enabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(values.module_media_enabled ?? "true") === "true"}
                  onChange={(e) =>
                    setValues({ ...values, module_media_enabled: e.target.checked ? "true" : "false" })
                  }
                />
                <Label>Media module enabled</Label>
              </div>
              <Button onClick={() => saveKeys(GENERAL_KEYS)} disabled={saving}>
                Save General
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand">
          <Card>
            <CardContent className="space-y-4 p-6">
              {field("site_title", "Site title")}
              {field("site_description", "Site description")}
              {field("founder_name", "Founder name")}
              {field("founder_title", "Founder title")}
              {field("primary_color", "Primary color")}
              <Button onClick={() => saveKeys(BRANDING_KEYS)} disabled={saving}>
                Save Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
