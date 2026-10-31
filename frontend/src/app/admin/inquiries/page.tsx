"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";

interface Inquiry {
  id: number;
  inquiry_type: string;
  name: string;
  email: string;
  company: string;
  message: string;
  is_acquisition?: boolean;
  nda_acknowledged?: boolean;
  is_read: boolean;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "acquisition">("all");

  const load = () => {
    const params = new URLSearchParams();
    if (filter === "unread") params.set("is_read", "false");
    if (filter === "acquisition") params.set("acquisition_only", "true");
    const qs = params.toString();
    adminFetch<Inquiry[]>(`/inquiries${qs ? `?${qs}` : ""}`).then(setInquiries).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [filter]);

  const markRead = async (id: number) => {
    await adminFetch(`/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    });
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Inquiries</h1>
      <div className="mt-4 flex gap-2">
        {(["all", "unread", "acquisition"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "acquisition" ? "Acquisition" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {inquiries.map((inq) => (
          <Card key={inq.id} className={!inq.is_read ? "border-accent/40" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{inq.inquiry_type}</span>
                    {inq.is_acquisition && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">Acquisition</span>
                    )}
                    {!inq.is_read && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Unread</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium">{inq.name} — {inq.company}</h3>
                  <p className="text-sm text-muted-foreground">{inq.email}</p>
                  <p className="mt-3 text-sm">{inq.message}</p>
                </div>
                {!inq.is_read && (
                  <Button variant="outline" size="sm" onClick={() => markRead(inq.id)}>
                    Mark read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
