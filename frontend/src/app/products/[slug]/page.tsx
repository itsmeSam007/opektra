import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/opektra";
import { ConektraExperience } from "@/components/opektra/product-experience";
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  return product ? { title: product.name, description: product.description, alternates: { canonical: `/products/${slug}` } } : { title: "Product not found" };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();
  if (product.slug === "conektra") return <ConektraExperience />;
  return <section className="op-page-hero"><div className="op-container"><p className="op-eyebrow">An Opektra product</p><h1>{product.name}</h1><p className="op-lead">{product.description}</p><a className="op-button" href={product.url} target="_blank" rel="noopener noreferrer">Visit {product.name}</a></div></section>;
}
