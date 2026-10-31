import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { articles, articleReadTime } from "@/lib/opektra";
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  return article ? { title: article.title, description: article.excerpt, alternates: { canonical: `/blog/${slug}` } } : { title: "Article not found" };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  if (!article) notFound();
  const related = articles.find(a => a.slug !== slug && a.category === article.category) ?? articles.find(a => a.slug !== slug)!;
  return <div className="studio-article-shell"><aside className="studio-contents" aria-label="Article contents"><span>IN THIS ARTICLE</span><ol>{article.sections.map((section, i) => <li key={section.heading}><a href={`#section-${i + 1}`}><span>0{i + 1}</span>{section.heading}</a></li>)}</ol><Link className="studio-inline-link" href="/blog"><ArrowLeft size={13} /> All articles</Link></aside><article className="op-article-page"><Link className="studio-inline-link" href="/blog"><ArrowLeft size={15} /> The Opektra journal</Link><h1>{article.title}</h1><div className="studio-article-meta"><span>Opektra · {article.category}</span><span>{articleReadTime(article)}</span></div><p className="studio-lead">{article.excerpt}</p><div className="op-article-cover"><Image src={article.image} alt={article.imageAlt} width={1000} height={650} preload sizes="(max-width: 650px) 100vw, 70vw" /></div><div className="op-article-body">{article.sections.map((section, i) => <section key={section.heading}><h2 id={`section-${i + 1}`}>{section.heading}</h2>{section.paragraphs.map(p => <p key={p.slice(0, 60)}>{p}</p>)}</section>)}</div>{article.takeaway && <div className="studio-article-takeaway"><span>TAKE THIS INTO YOUR NEXT BUILD</span><p>{article.takeaway}</p></div>}{article.sources && <div className="studio-article-sources">Further reading: {article.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <ArrowUpRight size={10} style={{ display: "inline" }} /></a>)}</div>}<div className="studio-article-related"><Link className="studio-inline-link" href={`/blog/${related.slug}`}>Next: {related.title} <ArrowRight size={15} /></Link><Link href="/products/conektra" className="studio-inline-link">Inside Conektra <ArrowUpRight size={15} /></Link></div></article></div>;
}
