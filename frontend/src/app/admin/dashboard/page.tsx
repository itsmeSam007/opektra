"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import { canAccess } from "@/lib/admin-nav";
import { adminFetch } from "@/lib/admin-api";

interface DashboardStats {
  unread_inquiries: number;
  unread_contacts: number;
  total_users: number;
  recent_publishes: { type: string; title: string; slug: string }[];
  integration_status: Record<string, { configured: boolean }>;
  system_health: { status: string; database: string; redis: string };
}

interface AnalyticsSummary {
  total_pageviews: number;
  unique_visitors: number;
  period_days: number;
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const perms = user?.permissions ?? [];
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    adminFetch<DashboardStats>("/admin/dashboard").then(setStats).catch(() => {});
    if (canAccess(perms, "analytics:read")) {
      adminFetch<AnalyticsSummary>("/analytics/summary?days=7").then(setAnalytics).catch(() => {});
    }
  }, [perms]);

  const unreadTotal = (stats?.unread_inquiries ?? 0) + (stats?.unread_contacts ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          {user ? `Signed in as ${user.email}` : "Site overview"}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {canAccess(perms, "blog:write") && (
          <Button asChild>
            <Link href="/admin/blog"><Plus className="mr-2 h-4 w-4" /> New Post</Link>
          </Button>
        )}
        {canAccess(perms, "products:write") && (
          <Button variant="outline" asChild>
            <Link href="/admin/products"><Plus className="mr-2 h-4 w-4" /> New Product</Link>
          </Button>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {canAccess(perms, "inquiries:read") && (
          <Link href="/admin/inquiries">
            <Card className={unreadTotal > 0 ? "border-destructive/50" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Unread Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{unreadTotal}</p>
                <p className="text-sm text-muted-foreground">Inquiries + contact submissions</p>
              </CardContent>
            </Card>
          </Link>
        )}

        {canAccess(perms, "analytics:read") && analytics && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Page Views (7d)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.total_pageviews}</p>
              <p className="text-sm text-muted-foreground">{analytics.unique_visitors} unique visitors</p>
            </CardContent>
          </Card>
        )}

        {canAccess(perms, "users:read") && stats && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total_users}</p>
            </CardContent>
          </Card>
        )}

        {stats?.system_health && canAccess(perms, "monitoring:read") && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Status: <span className="font-medium">{stats.system_health.status}</span></p>
              <p>Database: {stats.system_health.database}</p>
              <p>Redis: {stats.system_health.redis}</p>
            </CardContent>
          </Card>
        )}

        {stats?.integration_status && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>GitHub: {stats.integration_status.github?.configured ? "configured" : "not set"}</p>
              <p>YouTube: {stats.integration_status.youtube?.configured ? "configured" : "not set"}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {stats?.recent_publishes && stats.recent_publishes.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Recent Publishes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.recent_publishes.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.type}</span>{" "}
                  {item.title}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
