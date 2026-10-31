"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ContextMesh } from "./product-visuals";
import { products } from "@/lib/opektra";
import { WorkflowControls, workflowSteps } from "./workbench";

export function ProductStory({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (!compact && !reduced && window.matchMedia("(min-width: 901px) and (min-height: 821px) and (max-height: 1399px)").matches) setActive(Math.min(2, Math.floor(value * 3)));
  });
  return <section id="products" ref={ref} className={`studio-story ${compact ? "studio-story-compact" : ""}`}><div className="studio-story-sticky"><div className="op-container"><div className="studio-section-top"><p className="op-eyebrow">01 / Our work in the world</p><span className="studio-tiny">INDEPENDENT PRODUCTS. SHARED CRAFT.</span></div><div className="studio-story-grid"><div className="studio-story-copy"><span className="studio-product-tag">AN OPEKTRA PRODUCT</span><h2>{products[0].name}</h2><p className="studio-story-tagline">A whole business.<br /><em>One shared context.</em></p><p className="studio-body">Conversations, bookings and the operations behind them. See how one enquiry becomes connected work.</p><WorkflowControls active={active} onChange={setActive} /><Link className="studio-inline-link" href="/products/conektra">Inside Conektra <ArrowUpRight size={17} /></Link></div><div className="studio-story-demo"><ContextMesh active={active} /><div className="studio-story-caption" aria-live="polite"><span>0{active + 1} / 03</span><p>{workflowSteps[active].detail}</p><ArrowDown size={17} /></div></div></div></div></div></section>;
}
