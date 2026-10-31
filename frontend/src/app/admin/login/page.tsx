"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Content Management System</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4" data-testid="admin-login-form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                data-testid="admin-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                data-testid="admin-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {error && <p className="text-sm text-destructive" data-testid="admin-login-error">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading} data-testid="admin-login-submit">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
