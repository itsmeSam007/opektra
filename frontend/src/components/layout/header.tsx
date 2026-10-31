"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { routeCurrent } from "@/lib/navigation";

const links = [{ label: "Products", href: "/products" }, { label: "About us", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" }];
export function Brand() {
  return <Link className="op-brand" href="/" aria-label="Opektra home"><Image src="/opektra/brand-mark.png" alt="" width={45} height={45} priority /><span>Opektra</span></Link>;
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  if (pathname.startsWith("/admin")) return null;
  return <header className="op-header" onKeyDown={event => { if (event.key === "Escape" && open) { setOpen(false); menuRef.current?.focus(); } }}><div className="op-header-inner"><Brand /><nav className="op-desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={routeCurrent(pathname, link.href)}>{link.label}</Link>)}</nav><Link className="op-button op-small op-header-cta" href="/contact">Let’s talk <ArrowUpRight size={15} /></Link><button ref={menuRef} className="op-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-navigation" className="op-mobile-nav" aria-label="Mobile navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={routeCurrent(pathname, link.href)}>{link.label}<ArrowUpRight size={17} /></Link>)}</nav>}</header>;
}
