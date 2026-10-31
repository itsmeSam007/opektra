"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Brand } from "./header";
import { routeCurrent } from "@/lib/navigation";
import { company } from "@/lib/opektra";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const contact = pathname === "/contact";
  return <footer className="studio-footer"><div className="op-container"><div className="studio-footer-invitation"><div><p className="op-eyebrow">THOUGHTFUL SOFTWARE. NEW POSSIBILITIES.</p><h2>{contact ? <>Every useful product<br />starts with <em>a conversation.</em></> : <>Something worth building?<br /><em>Let’s talk about it.</em></>}</h2></div><a className="studio-footer-email" href={`mailto:${company.email}`}><span>WRITE TO OPEKTRA</span><strong>{company.email}</strong><ArrowUpRight size={24} /></a></div><div className="studio-footer-grid"><div className="studio-footer-brand"><Brand /><p>Independent minds.<br />Thoughtful design.<br />Software built with care.</p></div><nav aria-label="Company footer links"><span>COMPANY</span><Link href="/about" aria-current={routeCurrent(pathname, "/about")}>About Opektra</Link><Link href="/contact" aria-current={routeCurrent(pathname, "/contact")}>Contact</Link><Link href="/legal/privacy#privacy-contact">Privacy &amp; grievances</Link><a href={`mailto:${company.email}?subject=Website%20query`}>Queries: {company.owner}</a></nav><nav aria-label="Product footer links"><span>OUR WORK</span><Link href="/products" aria-current={routeCurrent(pathname, "/products")}>Our products</Link><Link href="/products/conektra" aria-current={routeCurrent(pathname, "/products/conektra")}>Inside Conektra</Link><a href="https://www.conektra.com" target="_blank" rel="noopener noreferrer">Visit Conektra <ArrowUpRight size={12} /></a></nav><nav aria-label="Journal footer links"><span>JOURNAL</span><Link href="/blog" aria-current={routeCurrent(pathname, "/blog")}>Ideas & engineering</Link><Link href="/blog/motion-that-explains-a-product" aria-current={routeCurrent(pathname, "/blog/motion-that-explains-a-product")}>Design in motion</Link></nav></div><div className="studio-footer-bottom"><small>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</small><span>PRODUCT THINKING × SOFTWARE ENGINEERING</span><nav aria-label="Footer navigation"><Link href="/legal/privacy" aria-current={routeCurrent(pathname, "/legal/privacy")}>Privacy</Link><Link href="/legal/terms" aria-current={routeCurrent(pathname, "/legal/terms")}>Terms</Link><a href="#main-content" aria-label="Back to top"><ArrowUp size={18} /></a></nav></div></div></footer>;
}
