"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch } from "@/lib/admin-api";

interface UserRow {
  id: number;
  email: string;
  is_active: boolean;
  role: string | null;
  role_id: number | null;
  created_at: string;
}

interface RoleRow {
  id: number;
  name: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");

  const load = () => {
    adminFetch<UserRow[]>("/users").then(setUsers).catch(() => {});
    adminFetch<RoleRow[]>("/roles").then(setRoles).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const createUser = async () => {
    if (!email || !password) return;
    await adminFetch("/users", {
      method: "POST",
      body: JSON.stringify({ email, password, role_id: roleId || null }),
    });
    setEmail("");
    setPassword("");
    load();
  };

  const deactivate = async (id: number) => {
    if (!confirm("Deactivate this user?")) return;
    await adminFetch(`/users/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-muted-foreground">Manage admin accounts and role assignments.</p>

      <Card className="mt-8">
        <CardContent className="grid gap-4 p-6 sm:grid-cols-4">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>
          <div>
            <Label>Role</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">—</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={createUser}>Invite User</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{u.email}</p>
                <p className="text-sm text-muted-foreground">
                  {u.role ?? "no role"} · {u.is_active ? "active" : "inactive"}
                </p>
              </div>
              {u.is_active && (
                <Button variant="outline" size="sm" onClick={() => deactivate(u.id)}>
                  Deactivate
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
