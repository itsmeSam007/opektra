import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Heart, UsersRound } from "lucide-react";
import { products } from "@/lib/opektra";
import { Reveal } from "./motion";

export function Approach() {
  return <section className="op-approach"><div className="op-container op-approach-grid"><Reveal><p className="op-eyebrow">03 — Our approach</p><h2>Built with care.<br />{" "}Made to make<br />{" "}a difference.</h2><p className="op-body-small">We believe great software starts with real understanding — and is shaped by people, for people.</p><Link className="op-text-link" href="/about">About our approach <ArrowUpRight size={16} /></Link></Reveal><div className="op-principles">{[{ icon: UsersRound, name: "Thoughtful design", text: "Clear, considered and a pleasure to use." }, { icon: Code2, name: "Solid engineering", text: "Reliable foundations for what’s next." }, { icon: Heart, name: "Human connection", text: "Built for real people and real relationships." }].map(({ icon: Icon, name, text }, i) => <Reveal key={name} delay={i * 0.1} className="op-principle"><div className="op-principle-icon"><Icon size={29} strokeWidth={1.5} /></div><span className="op-mono">0{i + 1}</span><h3>{name}</h3><p>{text}</p></Reveal>)}</div></div></section>;
}
export { Journal } from "./journal";

export function ProductCatalogue() {
  return <section className="op-page-content"><div className="op-container op-product-catalogue">{products.map((product, index) => <Reveal key={product.slug}><article className="op-catalogue-row"><div><p className="op-eyebrow">{String(index + 1).padStart(2, "0")} / {product.category}</p><Link href={`/products/${product.slug}`}><h2>{product.name}<ArrowUpRight size={32} /></h2></Link><p className="op-catalogue-tagline">{product.tagline}</p><p className="op-tech-note">Built by Opektra</p></div><div><p className="op-prose">{product.description}</p><ul>{product.capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul><div className="op-actions"><Link className="op-button op-button-secondary" href={`/products/${product.slug}`}>Discover {product.name}<ArrowRight size={15} /></Link><a className="op-text-link" href={product.url} target="_blank" rel="noopener noreferrer">Visit product website<ArrowUpRight size={15} /></a></div></div></article></Reveal>)}</div></section>;
}
