"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { articles, articleReadTime } from "@/lib/opektra";

export function Journal({ full = false }: { full?: boolean }) {
  const [filter, setFilter] = useState("All ideas");
  const ordered = [...articles.slice(2), ...articles.slice(0, 2)];
  const categories = ["All ideas", ...new Set(ordered.map(a => a.category))];
  const visible = full ? ordered.filter(a => filter === "All ideas" || a.category === filter) : ordered.slice(0, 3);
  return <section className={`studio-journal ${full ? "studio-journal-full" : ""}`}><div className="op-container"><div className="studio-journal-head"><div><p className="op-eyebrow">{full ? "The Opektra journal" : "02 / From the studio"}</p>{full ? <h1>Inside the work.<br /><em>Behind the software.</em></h1> : <h2>Ideas with<br /><em>engineering behind them.</em></h2>}<p className="studio-body">Practical perspectives on product thinking, clear interfaces and the details that make software work.</p></div>{!full && <Link className="studio-inline-link" href="/blog">Explore the journal <ArrowRight size={16} /></Link>}</div>{full && <><div className="studio-filter" aria-label="Article categories">{categories.map(c => <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>)}</div><p className="studio-journal-count" role="status">{visible.length} {visible.length === 1 ? "article" : "articles"} / {filter}</p></>}<div className="studio-article-grid">{visible.map((article, index) => <Link className={`studio-article-card ${full && index === 0 ? "studio-article-featured" : ""}`} key={article.slug} href={`/blog/${article.slug}`}><div className="studio-article-image"><Image src={article.image} alt={article.imageAlt} width={1000} height={650} sizes={full && index === 0 ? "(max-width: 650px) 100vw, 55vw" : "(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw"} loading={full && index === 0 ? "eager" : "lazy"} /><span><ArrowUpRight size={17} /></span></div><div className="studio-article-meta"><span>{article.category}</span><span>{articleReadTime(article)}</span></div><h3>{full && index === 0 && <span className="studio-featured-label">FEATURED PERSPECTIVE</span>}{article.title}</h3><p>{article.excerpt}</p></Link>)}</div></div></section>;
}
