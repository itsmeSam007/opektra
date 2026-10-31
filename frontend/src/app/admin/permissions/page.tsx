"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";

interface PermissionRow {
  id: number;
  code: string;
  description: string | null;
}

export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);

  useEffect(() => {
    adminFetch<PermissionRow[]>("/permissions").then(setPermissions).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Permissions</h1>
      <p className="mt-1 text-muted-foreground">Read-only permission registry for RBAC.</p>

      <div className="mt-8 space-y-2">
        {permissions.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <code className="text-sm font-medium">{p.code}</code>
              <span className="text-sm text-muted-foreground">{p.description}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
