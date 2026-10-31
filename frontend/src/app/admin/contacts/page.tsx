"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  inquiry_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = () => {
    const qs = unreadOnly ? "?is_read=false" : "";
    adminFetch<ContactSubmission[]>(`/contact/submissions${qs}`).then(setSubmissions).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [unreadOnly]);

  const markRead = async (id: number) => {
    await adminFetch(`/contact/submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    });
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Contact Inbox</h1>
      <div className="mt-4">
        <Button
          variant={unreadOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setUnreadOnly(!unreadOnly)}
        >
          {unreadOnly ? "Showing unread" : "Show all"}
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {submissions.map((sub) => (
          <Card key={sub.id} className={!sub.is_read ? "border-accent/40" : ""}>
            <CardContent className="flex items-start justify-between gap-4 p-6">
              <div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{sub.inquiry_type}</span>
                <h3 className="mt-2 font-medium">{sub.name}</h3>
                <p className="text-sm text-muted-foreground">{sub.email}</p>
                <p className="mt-3 text-sm">{sub.message}</p>
              </div>
              {!sub.is_read && (
                <Button variant="outline" size="sm" onClick={() => markRead(sub.id)}>
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
