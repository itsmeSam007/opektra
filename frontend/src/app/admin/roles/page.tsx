"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";

interface RoleRow {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
}

interface PermissionRow {
  id: number;
  code: string;
  description: string | null;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [editing, setEditing] = useState<RoleRow | null>(null);

  const load = () => {
    adminFetch<RoleRow[]>("/roles").then(setRoles).catch(() => {});
    adminFetch<PermissionRow[]>("/permissions").then(setPermissions).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const togglePerm = (code: string) => {
    if (!editing) return;
    const has = editing.permissions.includes(code);
    setEditing({
      ...editing,
      permissions: has ? editing.permissions.filter((p) => p !== code) : [...editing.permissions, code],
    });
  };

  const save = async () => {
    if (!editing) return;
    await adminFetch(`/roles/${editing.id}`, {
      method: "PUT",
      body: JSON.stringify({ permission_codes: editing.permissions }),
    });
    setEditing(null);
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Roles</h1>
      <p className="mt-1 text-muted-foreground">Edit role permission assignments.</p>

      <div className="mt-8 space-y-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{role.name}</p>
                <p className="text-sm text-muted-foreground">{role.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{role.permissions.length} permissions</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(role)}>
                Edit Permissions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="font-semibold">Permissions for {editing.name}</h2>
            <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
              {permissions.map((p) => (
                <label key={p.code} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.permissions.includes(p.code)}
                    onChange={() => togglePerm(p.code)}
                  />
                  <span>{p.code}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
