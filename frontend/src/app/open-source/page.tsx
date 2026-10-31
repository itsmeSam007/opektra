import type { Metadata } from "next";
import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { api, type GitHubRepo } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Open Source",
  description: "Open source contributions and repositories from Soumen Karmakar.",
  path: "/open-source",
});

export default async function OpenSourcePage() {
  let repos: GitHubRepo[] = [];
  let stats = { public_repos: 0, followers: 0 };
  try {
    [repos, stats] = await Promise.all([api.github.repos(), api.github.stats()]);
  } catch {
    repos = [];
  }

  return (
    <Section>
      <Container>
        <SectionHeader
          label="Open Source"
          title="Building in Public"
          description="Contributing to the open source ecosystem while building enterprise products."
        />

        <div className="mt-12 flex justify-center gap-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">{stats.public_repos}</p>
            <p className="text-sm text-muted-foreground">Repositories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">{stats.followers}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <Card className="group h-full transition-all hover:border-accent/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold group-hover:text-accent">{repo.name}</h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.language && <span>{repo.language}</span>}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> {repo.stargazers_count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}
