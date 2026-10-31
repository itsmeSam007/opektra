import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() { return <section className="op-empty-page"><p className="op-eyebrow">404 — A little off track</p><h1>Page not found.</h1><p>Let’s get you back to something useful.</p><Link className="op-button" href="/">Back to Opektra <ArrowRight size={16} /></Link></section>; }
