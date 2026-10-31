"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Braces } from "lucide-react";
import { BuildLayers } from "./product-visuals";

export function Hero() {
  const [active, setActive] = useState(0);
  return <section className="studio-hero studio-environment"><div className="op-container studio-hero-grid"><div className="studio-hero-copy"><p className="op-eyebrow"><span className="studio-status-dot" /> Independent minds. Thoughtful software.</p><h1>Considered design.<br /><em>Serious engineering.</em><br />Useful software.</h1><p className="studio-lead">We turn the complexity of everyday business into products that feel beautifully clear.</p><div className="op-actions"><Link className="op-button" href="/products">Explore our products <ArrowUpRight size={17} /></Link><Link className="studio-inline-link" href="/about">Meet Opektra <ArrowRight size={16} /></Link></div><div className="studio-hero-note"><Braces size={18} /><p>From the first idea to the details that make it work.</p></div></div><div className="studio-hero-visual"><BuildLayers active={active} /><div className="studio-hero-select" aria-label="Studio process stages">{["Understand", "Shape", "Build"].map((label, index) => <button type="button" key={label} aria-pressed={active === index} onClick={() => setActive(index)}>{label}</button>)}</div></div></div><div className="op-container studio-hero-bottom"><a href="#products">Discover what we’re building <ArrowDown size={15} /></a><span>PRODUCT THINKING <i /> INTERFACE DESIGN <i /> SOFTWARE ENGINEERING</span></div></section>;
}
