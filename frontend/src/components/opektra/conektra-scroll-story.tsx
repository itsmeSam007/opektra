"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, Check, CreditCard, GitBranch, Layers, MessageSquare, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "./motion";
import "./conektra-scroll-story.css";

const pinQuery = "(min-width: 901px) and (min-height: 821px) and (max-height: 1399px) and (prefers-reduced-motion: no-preference)";
function subscribePin(callback: () => void) {
  const media = window.matchMedia(pinQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

const chapters = [
  { name: "Conversation", verb: "UNDERSTAND THE CUSTOMER", title: "A question arrives. The context begins.", text: "A guest asks about a stay. Conektra brings the conversation, your business knowledge and the customer’s history together—across WhatsApp, web, SMS and email.", points: ["Your brand voice. Your policies. One inbox.", "Image understanding and a shared customer record", "Team handoff, realtime alerts and clear ownership"], result: "The customer is understood.", icon: MessageSquare },
  { name: "Booking", verb: "TURN INTENT INTO A COMMITMENT", title: "A conversation becomes a confirmed plan.", text: "The request becomes a booking inside Conektra. Availability, branch, capacity and business rules are checked first. Sensitive changes wait for someone with the right permission.", points: ["Location, staff and resource availability", "Bookings, reservations and reminders", "Approval gates for cancellations and refunds"], result: "The commitment is clear.", icon: CalendarDays },
  { name: "Operations", verb: "CARRY THE WORK FORWARD", title: "One booking. A whole business in motion.", text: "Conektra carries the same context to the front desk, the team, the bill and the next follow-up. Everyone works from the customer’s story, with a clear next action.", points: ["Customer 360, consent and service history", "Team tasks, POS, payments and inventory", "Follow-ups, recovery and business insights"], result: "The business moves together.", icon: GitBranch },
];

function LayerContent({ index }: { index: number }) {
  if (index === 0) return <>
    <div className="cx-layer-channels"><span>WhatsApp</span><span>Web</span><span>SMS / Email</span></div>
    <div className="cx-layer-message"><small>GUEST / NEW ENQUIRY</small><p>“A room for Friday? We’ll arrive after 10.”</p></div>
    <div className="cx-layer-response"><MessageSquare size={18} /><div><strong>Conektra keeps the details together.</strong><p>Stay dates, availability and the late-arrival request become part of one customer journey.</p></div></div>
    <div className="cx-layer-chips"><span><Check size={12} />Business knowledge</span><span><Check size={12} />Customer history</span><span><Users size={12} />Team handoff</span></div>
  </>;
  if (index === 1) return <>
    <div className="cx-layer-booking"><div><span>FRI</span><CalendarDays size={27} /></div><div><small>FROM REQUEST TO RESERVATION</small><h4>A stay, confirmed.</h4><p>Guest details and arrival context stay attached.</p></div></div>
    <ol className="cx-layer-gates">{["Branch & room availability", "Capacity & business rules", "Guest details & confirmation"].map((text, i) => <motion.li key={text} initial={false} animate={{ x: [5, 0] }} transition={{ delay: i * .1 }}><Check size={14} />{text}<span>CHECKED</span></motion.li>)}</ol>
    <div className="cx-layer-approval"><ShieldCheck size={17} /><span>Risky changes? The right person approves.</span></div>
  </>;
  return <>
    <div className="cx-layer-customer"><span>360°</span><div><strong>One customer. One shared record.</strong><small>History · consent · lifetime value</small></div></div>
    <div className="cx-layer-work">{[{ icon: Users, title: "Team", note: "Arrival & responsibility" }, { icon: CreditCard, title: "Commerce", note: "Folio, bill & payment" }, { icon: Layers, title: "Inventory", note: "Stock & preparation" }, { icon: ArrowRight, title: "Follow-up", note: "Next visit & recovery" }].map(({ icon: Icon, title, note }) => <div key={title}><Icon size={19} /><strong>{title}</strong><span>{note}</span></div>)}</div>
    <div className="cx-layer-approval"><Check size={15} /><span>Every next action carries the context forward.</span></div>
  </>;
}

export function ConektraScrollStory() {
  const track = useRef<HTMLDivElement>(null);
  const manualPosition = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const pinned = useSyncExternalStore(subscribePin, () => window.matchMedia(pinQuery).matches, () => false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const photoY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (!pinned) return;
    if (manualPosition.current !== null) {
      if (Math.abs(window.scrollY - manualPosition.current) < 24) return;
      manualPosition.current = null;
    }
    setActive(Math.min(2, Math.floor(value * 3)));
  });

  const selectChapter = (index: number) => {
    manualPosition.current = window.scrollY;
    setActive(index);
  };
  const chapter = chapters[active];

  return <section id="product-journey" className="cx-scroll-story" data-pinned={pinned} data-chapter={active}>
    <div className="op-container cx-scroll-intro"><Reveal className="cx-heading"><p className="op-eyebrow">01 / The Conektra story</p><h2>One customer journey.<br /> <em>Every layer of your business.</em></h2><p>Conversations become commitments. Commitments become coordinated work. Follow the context through your Customer Business Operations OS.</p></Reveal></div>
    <div ref={track} className="cx-scroll-track">
      <div className="cx-scroll-pin">
        <div className="op-container cx-scroll-frame">
          <div className="cx-scroll-topline"><span>CONEKTRA / THE CUSTOMER BUSINESS OPERATIONS OS</span><span><ArrowDown size={12} />{pinned ? "SCROLL TO FOLLOW THE CONTEXT" : "CHOOSE A CHAPTER TO FOLLOW THE CONTEXT"}</span></div>
          <div className="cx-scroll-grid">
            <div className="cx-scroll-copy" aria-live="polite">
              <div className="cx-scroll-chapter"><span>0{active + 1}</span><span>/ 03 &nbsp; {chapter.verb}</span></div>
              <motion.div key={active} initial={reduced ? false : { y: 15, opacity: .65 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : .5 }}>
                <h3>{chapter.title.split(" ").map((word, i) => <span key={`${word}-${i}`}><motion.span initial={false} animate={reduced ? {} : { y: [12, 0] }} transition={{ duration: .45, delay: i * .025 }}>{word}</motion.span>{" "}</span>)}</h3>
                <p>{chapter.text}</p><ul>{chapter.points.map(point => <li key={point}><Check size={14} />{point}</li>)}</ul>
              </motion.div>
              <div className="cx-scroll-outcome"><span className="studio-status-dot" />{chapter.result}</div>
            </div>
            <motion.div className="cx-layer-stage" role="group" aria-label="Conektra workflow" style={{ y: pinned && !reduced ? sceneY : 0 }}>
              <motion.div className="cx-layer-backdrop" aria-hidden="true" style={{ y: pinned && !reduced ? photoY : 0 }}><Image src="/opektra/conektra-hotel.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" /></motion.div>
              <div id="cx-story-panel" className="cx-layer-stack">{chapters.map(({ name, icon: Icon }, index) => {
                const distance = index - active;
                return <motion.article key={name} className="cx-story-layer" data-current={active === index} aria-hidden={active !== index} initial={false} animate={{ x: reduced ? 0 : distance < 0 ? -22 : distance * 19, y: reduced ? 0 : distance < 0 ? -28 : distance * 24, scale: reduced ? 1 : distance < 0 ? .94 : 1 - distance * .035, rotate: reduced ? 0 : distance * 1.4, opacity: active === index ? 1 : reduced ? 0 : distance < 0 ? .12 : .55, zIndex: active === index ? 30 : 20 - index }} transition={{ type: "spring", stiffness: 100, damping: 23 }}>
                  <div className="cx-layer-header"><span><Icon size={16} />CONEKTRA / {name.toUpperCase()}</span><span>0{index + 1}</span></div>
                  <div className="cx-layer-content"><LayerContent index={index} /></div>
                </motion.article>;
              })}</div>
              <div className="cx-context-thread"><span><GitBranch size={15} />CONTEXT THAT CONTINUES</span><strong>Late arrival requested</strong><motion.span className="cx-thread-dot" aria-hidden="true" initial={false} animate={{ x: reduced ? 0 : active * 9 }} /></div>
            </motion.div>
          </div>
          <div className="cx-scroll-bottom"><nav className="cx-scroll-controls" aria-label="Conektra story chapters">{chapters.map(({ name }, index) => <button key={name} type="button" onClick={() => selectChapter(index)} aria-pressed={active === index} aria-controls="cx-story-panel"><span>0{index + 1}</span><strong>{name}</strong><ArrowRight size={15} /></button>)}</nav><span className="cx-scroll-caption">Your business, connected.</span></div>
          <div className="cx-scroll-progress" aria-hidden="true"><motion.span style={{ scaleX: pinned ? scrollYProgress : (active + 1) / 3 }} /></div>
        </div>
      </div>
    </div>
  </section>;
}
