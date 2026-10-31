"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Braces, Check, Copy, Layers, Mail, MessageSquare } from "lucide-react";
import { company } from "@/lib/opektra";

const topics = [
  { name: "A product idea", subject: "A product idea for Opektra", brief: "The problem we want to solve:\nWho it affects:\nWhat a useful outcome looks like:\nOur current stage:" },
  { name: "Product enquiries", subject: "Opektra product enquiry", brief: "The product I’m interested in:\nWhat I’d like to understand:\nOur business context:" },
  { name: "Partnerships", subject: "A partnership conversation", brief: "A little about us:\nThe opportunity:\nWhy it could be a good fit:" },
];
export function ContactExperience() {
  const [topic, setTopic] = useState(0);
  const [copyState, setCopyState] = useState("");
  async function copyEmail() {
    try { await navigator.clipboard.writeText(company.email); setCopyState("Email copied"); }
    catch { setCopyState("Select the email address to copy it."); }
  }
  return <><section className="studio-contact-hero studio-environment"><div className="op-container"><div className="studio-contact-intro"><p className="op-eyebrow">Start something thoughtful</p><h1>Bring us the problem<br /><em>you want to solve.</em></h1><p className="studio-lead">An idea taking shape. A workflow that could work better. A product question. Let’s find the useful next conversation.</p><div className="studio-contact-proof"><Braces size={19} /><span>Product thinking. Interface design. Software engineering.</span></div></div><div className="studio-contact-card"><div className="studio-section-top"><span className="studio-tiny">01 / LET’S CONNECT</span><Mail size={20} /></div><h2>What’s on your mind?</h2><div className="studio-filter" aria-label="Enquiry topic">{topics.map((item, i) => <button type="button" key={item.name} aria-pressed={topic === i} onClick={() => setTopic(i)}>{item.name}</button>)}</div><div className="studio-brief" aria-live="polite"><span className="studio-tiny">A USEFUL PLACE TO START</span><p>{topics[topic].brief}</p></div><a className="op-button" href={`mailto:${company.email}?subject=${encodeURIComponent(topics[topic].subject)}&body=${encodeURIComponent(topics[topic].brief)}`}>Start the conversation <ArrowUpRight size={17} /></a><div className="studio-email-copy"><a href={`mailto:${company.email}`}>{company.email}</a><button type="button" aria-label="Copy email address" onClick={copyEmail}>{copyState === "Email copied" ? <Check size={16} /> : <Copy size={16} />}</button></div><p role="status" className="studio-copy-status">{copyState || "Your email opens in your preferred email app."}</p></div></div></section><section className="op-container studio-contact-reasons"><div className="studio-heading"><p className="op-eyebrow">Why Opektra</p><h2>Care for the idea.<br /><em>Care for the execution.</em></h2></div><div className="studio-method-grid">{[{ icon: MessageSquare, title: "We start with the real problem", text: "The people, the work and the outcome shape the product." }, { icon: Layers, title: "Design and engineering together", text: "Clear interfaces and considered behaviour belong in the same conversation." }, { icon: Braces, title: "See the thinking in the work", text: "Explore Conektra and our journal to understand how we approach building." }].map(({ icon: Icon, title, text }, i) => <article key={title}><span className="studio-tiny">0{i + 1}</span><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}</div><div className="studio-contact-links"><Link className="studio-inline-link" href="/products/conektra">Explore our product craft <ArrowRight size={16} /></Link><a className="studio-inline-link" href="https://www.conektra.com/contact" target="_blank" rel="noopener noreferrer">Looking for Conektra? Contact the product team <ArrowUpRight size={16} /></a></div></section></>;
}
