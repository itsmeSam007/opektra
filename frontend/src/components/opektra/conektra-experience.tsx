"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BrainCircuit, CalendarDays, Check, ChevronDown, CircleDot, GitBranch, LockKeyhole, Mail, MessageSquare, Phone, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { conektraCapabilities, industryStories, serviceDomains } from "@/lib/conektra";
import { WorkflowControls } from "./workbench";
import { Reveal } from "./motion";
import { ConektraScrollStory } from "./conektra-scroll-story";
import "./conektra.css";

const journey = [
  { title: "A conversation starts.", tag: "CONEKTRA CONVERSATIONS", icon: MessageSquare, message: "Can I book a room for Friday? We’ll arrive late.", reply: "Of course. Let’s check your dates and room availability. I’ll keep your late-arrival request with the booking.", checks: ["Intent understood", "Knowledge Base consulted", "Guest context captured"], status: "Enquiry understood" },
  { title: "Intent becomes action.", tag: "SILENT BOOKING", icon: CalendarDays, message: "A room, a date. One clear next step.", reply: "Availability and business rules are checked before confirmation. Sensitive changes go to the approval queue.", checks: ["Location & capacity checked", "Trust rules evaluated", "Booking confirmed"], status: "Booking confirmed" },
  { title: "The business moves together.", tag: "CONNECTED OPERATIONS", icon: GitBranch, message: "The guest’s story travels with the work.", reply: "Front desk has the arrival context. The team has the next task. Billing and follow-ups connect to the same customer.", checks: ["Team responsibility assigned", "Folio & customer linked", "Reminder ready"], status: "Ready for the team" },
];

function JourneyConsole({ active }: { active: number }) {
  const reduced = useReducedMotion();
  const stage = journey[active];
  const Icon = stage.icon;
  return <div className="cx-console">
    <div className="cx-console-bar"><span><CircleDot size={13} /> CONEKTRA / ONE CONNECTED JOURNEY</span><span>0{active + 1} / 03</span></div>
    <div className="cx-console-body" aria-live="polite">
      <div className="cx-console-title"><span className="cx-icon"><Icon size={21} /></span><div><small>{stage.tag}</small><h3>{stage.title}</h3></div></div>
      <motion.div key={active} initial={reduced ? false : { y: 8 }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : .4 }}>
        <p className="cx-message">{stage.message}</p><p className="cx-reply"><Sparkles size={15} />{stage.reply}</p>
        <div className="cx-console-checks">{stage.checks.map((text, i) => <motion.div key={text} initial={false} animate={{ x: 0 }} whileInView={reduced ? {} : { x: [7, 0] }} transition={{ delay: i * .12, duration: .35 }}><Check size={13} /><span>{text}</span></motion.div>)}</div>
      </motion.div>
    </div>
    <div className="cx-console-foot"><span className="studio-status">{stage.status}</span></div>
  </div>;
}

function VoiceGraphic() {
  const reduced = useReducedMotion();
  return <div className="cx-voice-graphic"><div className="cx-panel-label"><Phone size={16} /> VOICE AI / INBOUND RECEPTIONIST</div><div className="cx-wave" aria-hidden="true">{Array.from({ length: 33 }, (_, i) => <motion.i key={i} style={{ height: 12 + ((i * 17) % 63) }} whileInView={reduced ? {} : { scaleY: [1, .35, .8, 1] }} transition={{ duration: 1.4, delay: i * .035, repeat: 2 }} />)}</div><h3>“We’re arriving after 10.<br />{" "}Can you let the team know?”</h3><div className="cx-voice-result"><Check size={17} /><div><strong>Context, captured.</strong><span>Transcript → summary → team handoff</span></div><ArrowRight size={18} /></div></div>;
}

export function ConektraExperience() {
  const [active, setActive] = useState(0);
  const [industry, setIndustry] = useState(0);
  const current = industryStories[industry];
  return <div className="cx-page">
    <section className="cx-hero studio-environment">
      <div className="op-container cx-hero-grid">
        <div className="cx-hero-copy"><Link href="/products" className="studio-inline-link">Our products <ArrowRight size={15} /></Link><p className="op-eyebrow">Conektra / An Opektra product</p><h1>Every conversation.<br />{" "}A whole business<br />{" "}<em>moving forward.</em></h1><p className="cx-lead">Conektra is your Customer Business Operations OS. Bring conversations, bookings, teams, payments and growth together in one connected workspace.</p><div className="op-actions"><a href="#product-journey" className="op-button">See the story <ArrowRight size={17} /></a><a href="https://www.conektra.com/ai-receptionist" target="_blank" rel="noopener noreferrer" className="studio-inline-link">Try Conektra live <ArrowUpRight size={16} /></a></div><div className="cx-channels" aria-label="Supported conversation channels"><span><MessageSquare size={14} />WhatsApp</span><span><CircleDot size={14} />Web</span><span><Phone size={14} />SMS</span><span><Mail size={14} />Email</span></div></div>
        <div className="cx-hero-scene studio-product-hero-demo"><div className="cx-hero-photo"><Image src="/opektra/conektra-hotel.webp" alt="A hotel receptionist welcoming a guest at the front desk" fill preload sizes="(max-width: 900px) 100vw, 50vw" /><div className="cx-photo-label"><span className="studio-status-dot" /> REAL BUSINESSES. CONNECTED WORK.</div></div><JourneyConsole active={active} /><WorkflowControls active={active} onChange={setActive} /></div>
      </div>
      <div className="op-container cx-foundation"><span>ONE CONNECTED FOUNDATION</span><div><strong>14</strong><span>service domains</span></div><div><strong>17</strong><span>selectable service packs</span></div><div><strong>01</strong><span>shared customer context</span></div></div>
    </section>

    <ConektraScrollStory />

    <section className="cx-intelligence"><div className="op-container"><Reveal className="cx-heading"><p className="op-eyebrow">02 / Connected voice. Shared knowledge.</p><h2>Answers that know your business.<br />{" "}<em>A voice that keeps it human.</em></h2></Reveal><div className="cx-intelligence-grid"><VoiceGraphic /><div className="cx-brain-copy"><span className="cx-kicker"><BrainCircuit size={16} /> CONEKTRA BUSINESS KNOWLEDGE</span><h3>Grounded in what<br />{" "}your business knows.</h3><p>Your FAQ, service details and policies shape the response. Knowledge Autopilot surfaces gaps and prepares drafts for an owner to review. Quality screens and vertical starter packs help the knowledge grow with you.</p><ul><li><Check size={15} />Inbound voice, summaries & human transfer</li><li><Check size={15} />Consent-gated outbound calls & reminders</li><li><Check size={15} />Confidence gates & DTMF fallback for hotel flows</li></ul><p className="cx-fine">Voice is an add-on. Conektra Wallet tracks credits, engines and usage. Platform tools support model evaluation and engine governance.</p></div></div></div></section>

    <section className="op-container cx-section cx-growth"><Reveal className="cx-heading"><p className="op-eyebrow">03 / The next opportunity is already in the story</p><h2>Turn customer context<br />{" "}<em>into your next move.</em></h2><p>Find the lead that needs attention, the customer who might not return and the revenue waiting to be recovered.</p></Reveal><div className="cx-growth-grid">{[{ n: '01', icon: Users, title: 'Recognise the signal', text: 'Customer health, churn signals, lead scoring and missed-revenue insights surface in Business Intelligence and the Command Center.', tag: '7 intelligence engines' }, { n: '02', icon: Sparkles, title: 'Choose the next action', text: 'Growth Hub and Conektra’s Business Advisor connect signals to playbooks. Campaign Studio prepares Meta templates, posters and launch readiness.', tag: 'Consent-aware campaigns' }, { n: '03', icon: TrendingUp, title: 'Keep the momentum', text: 'Automate reminders, missed-call text-back and win-back. Track reviews, campaign ROI and recovery. Add Growth Engine for ads and landing-page leads.', tag: 'Growth Engine · paid add-on' }].map(({ n, icon: Icon, title, text, tag }) => <Reveal key={n} className="cx-growth-card"><div><span>{n}</span><Icon size={24} /></div><h3>{title}</h3><p>{text}</p><span className="cx-growth-tag">{tag}</span></Reveal>)}</div></section>

    <section className="cx-industries"><div className="op-container"><Reveal className="cx-heading"><p className="op-eyebrow">04 / Built for the way your business works</p><h2>Shared intelligence.<br />{" "}<em>Industry-specific depth.</em></h2><p>Fourteen service domains connect adapters, templates, trust rules, knowledge packs and onboarding. The workflow changes with the business.</p></Reveal><div className="studio-filter cx-industry-tabs" aria-label="Industry examples">{industryStories.map((item, i) => <button key={item.name} type="button" aria-pressed={industry === i} onClick={() => setIndustry(i)}>{item.name}<ArrowUpRight size={14} /></button>)}</div><div className="cx-industry-story"><div className="cx-industry-photo"><Image key={current.image} src={`/opektra/conektra-${current.image}.webp`} alt={current.alt} fill sizes="(max-width: 900px) 100vw, 50vw" /><span>{current.name.toUpperCase()} / IN ITS ELEMENT</span></div><div className="cx-industry-copy" aria-live="polite"><span className="cx-kicker">PURPOSE-BUILT WORKFLOWS</span><h3>{current.title}</h3><p>{current.text}</p><ul>{current.steps.map(p => <li key={p}><Check size={15} />{p}</li>)}</ul><small>{current.footer}</small></div></div><details className="cx-domains"><summary>Explore all 14 service domains <ChevronDown size={19} /></summary><div className="cx-domain-grid">{serviceDomains.map(([name, text], i) => <div key={name}><span>{String(i + 1).padStart(2, '0')}</span><h3>{name}</h3><p>{text}</p></div>)}</div></details><div className="cx-pack-note"><div><strong>17 selectable service packs</strong><p>The 14 service domains, plus Local Service, School and Company HR. Dental is a Clinic subtype.</p></div><div><strong>Retail / D2C</strong><p>A separate commerce signup with a commerce-first workspace, sales, orders and returns.</p></div></div></div></section>

    <section id="capabilities" className="op-container cx-section"><Reveal className="cx-heading"><p className="op-eyebrow">05 / Explore the connected platform</p><h2>The detail behind<br />{" "}<em>the bigger picture.</em></h2><p>Go deeper into the workspace, the channels and the platform that holds them together.</p></Reveal><div className="cx-capabilities">{conektraCapabilities.map((group, i) => <details key={group.title}><summary><span className="cx-cap-number">{String(i + 1).padStart(2, '0')}</span><div><h3>{group.title}</h3><p>{group.summary}</p></div><ChevronDown size={20} /></summary><div className="cx-cap-body"><ul>{group.items.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>{group.note && <p className="cx-cap-note">{group.note}</p>}</div></details>)}</div></section>

    <section className="cx-control"><div className="op-container cx-control-grid"><div><p className="op-eyebrow">06 / Automation with accountability</p><h2>More connected work.<br />{" "}<em>Clear human control.</em></h2><p>Consent, permissions and approvals are part of the work, from the first message to the last action.</p><a className="studio-inline-link" href="https://www.conektra.com/security" target="_blank" rel="noopener noreferrer">Explore Conektra security <ArrowUpRight size={16} /></a></div><div className="cx-control-list">{[{ icon: ShieldCheck, title: 'Permission before action', text: 'Branch access, role templates and audit trails keep responsibility clear. Sensitive actions enter an approval queue.' }, { icon: Users, title: 'A person when it matters', text: 'Human handoff, SLA routing and realtime alerts connect the right team member to the conversation.' }, { icon: LockKeyhole, title: 'Consent that travels with the customer', text: 'STOP/START, DND, communication purposes and quiet hours guide outreach across the journey.' }].map(({ icon: Icon, title, text }) => <div key={title}><Icon size={22} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <section className="op-container cx-outro"><span className="cx-kicker">CONEKTRA / YOUR BUSINESS. CONNECTED.</span><h2>See what connected<br />{" "}<em>could mean for your business.</em></h2><div className="op-actions"><a className="op-button" href="https://www.conektra.com/" target="_blank" rel="noopener noreferrer">Explore Conektra <ArrowUpRight size={17} /></a><a className="studio-inline-link" href="https://www.conektra.com/ai-receptionist" target="_blank" rel="noopener noreferrer">Meet the Conektra receptionist <ArrowUpRight size={16} /></a></div><p className="cx-fine">Features vary by plan, industry, integration and configuration. Check current availability with Conektra.</p></section>
  </div>;
}
