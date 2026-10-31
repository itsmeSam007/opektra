"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";

interface ReadyResponse {
  status: string;
  checks: { database: string; redis: string };
}

export default function AdminMonitoringPage() {
  const [ready, setReady] = useState<ReadyResponse | null>(null);
  const [health, setHealth] = useState<{ status: string; service: string } | null>(null);

  useEffect(() => {
    fetch("/api/v1/ready")
      .then((r) => r.json())
      .then(setReady)
      .catch(() => {});
    fetch("/api/v1/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold">Monitoring</h1>
      <p className="mt-1 text-muted-foreground">API health and dependency status.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Status: <span className="font-medium">{health?.status ?? "—"}</span></p>
            <p>Service: {health?.service ?? "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Status: <span className="font-medium">{ready?.status ?? "—"}</span></p>
            <p>Database: {ready?.checks.database ?? "—"}</p>
            <p>Redis: {ready?.checks.redis ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Dashboard Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Integration configuration and lead counts are available on the{" "}
            <a href="/admin/dashboard" className="text-accent underline">dashboard</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
