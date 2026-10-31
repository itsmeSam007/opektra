"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-api";

interface Summary {
  total_pageviews: number;
  unique_visitors: number;
  period_days: number;
}

interface PageviewPoint {
  date: string;
  count: number;
}

interface TopPage {
  path: string;
  views: number;
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [series, setSeries] = useState<PageviewPoint[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);

  useEffect(() => {
    adminFetch<Summary>("/analytics/summary?days=30").then(setSummary).catch(() => {});
    adminFetch<PageviewPoint[]>("/analytics/pageviews?days=30").then(setSeries).catch(() => {});
    adminFetch<TopPage[]>("/analytics/top-pages?days=30&limit=10").then(setTopPages).catch(() => {});
  }, []);

  const maxCount = Math.max(...series.map((p) => p.count), 1);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-1 text-muted-foreground">First-party page view metrics (30-day window).</p>

      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.total_pageviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.unique_visitors}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Daily Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          {series.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet. Public page views are tracked automatically.</p>
          ) : (
            <div className="flex h-32 items-end gap-1">
              {series.map((p) => (
                <div
                  key={p.date}
                  className="flex-1 rounded-t bg-accent/60"
                  style={{ height: `${(p.count / maxCount) * 100}%`, minHeight: p.count > 0 ? 4 : 0 }}
                  title={`${p.date}: ${p.count}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Top Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topPages.map((p) => (
            <div key={p.path} className="flex justify-between text-sm">
              <code>{p.path}</code>
              <span className="text-muted-foreground">{p.views} views</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
