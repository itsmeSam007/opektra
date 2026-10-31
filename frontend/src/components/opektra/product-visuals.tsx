"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Braces, CalendarDays, Check, CircleDot, GitBranch, Layers, MessageSquare, Package, Send, ShieldCheck, Users } from "lucide-react";

const buildPhases = [
  { title: "Understand the real work.", note: "People, decisions and the outcome that matters.", items: ["People", "Decisions", "Opportunity"] },
  { title: "Give the idea a clear shape.", note: "Structure, interaction and a shared product language.", items: ["Structure", "Interaction", "Prototype"] },
  { title: "Make the details work together.", note: "Behaviour, resilience and a considered handoff.", items: ["Behaviour", "Recovery", "Delivery"] },
];

/** Company craft, rather than a replica of a product's application interface. */
export function BuildLayers({ active }: { active: number }) {
  const reduced = useReducedMotion();
  const phase = buildPhases[active];
  return <div className="craft-scene" aria-label="Opektra product-building process">
    <div className="craft-coordinate"><span>OPEKTRA / STUDIO NOTES</span><span>IDEA → USEFUL SOFTWARE</span></div>
    <div className="craft-depth" aria-hidden="true"><div /><div /></div>
    <motion.div className="craft-plane" animate={{ rotateX: reduced ? 0 : 4, rotateY: reduced ? 0 : -9, y: reduced ? 0 : active * -4 }} transition={{ duration: reduced ? 0 : .6 }}>
      <div className="craft-plane-top"><Braces size={21} /><span>THE MAKING OF SOMETHING USEFUL</span><span>0{active + 1}</span></div>
      <div className="craft-wireframe" aria-hidden="true"><div className="craft-wire-wide" /><div /><div /><div className="craft-wire-wide" /></div>
      <div className="craft-plane-copy" aria-live="polite"><h2>{phase.title}</h2><p>{phase.note}</p></div>
      <div className="craft-decisions">{phase.items.map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong><CircleDot size={13} /></div>)}</div>
      <div className="craft-plane-foot"><span>THINK IT THROUGH. BUILD IT WITH CARE.</span><GitBranch size={17} /></div>
    </motion.div>
    <div className="craft-margin-note"><span className="studio-status-dot" /> Thought meets execution.</div>
  </div>;
}

const meshNodes = [
  { label: "Conversations", icon: MessageSquare, group: 0 },
  { label: "Customer context", icon: Users, group: 0 },
  { label: "Bookings", icon: CalendarDays, group: 1 },
  { label: "Billing", icon: Layers, group: 2 },
  { label: "Stock", icon: Package, group: 2 },
  { label: "Follow-ups", icon: Send, group: 2 },
];
const statuses = ["Enquiry received", "Booking confirmed", "Ready for the team"];

/** An original relationship map: no simulated chat or named customer record. */
export function ContextMesh({ active }: { active: number }) {
  return <div className="context-mesh" data-stage={active}>
    <div className="mesh-top"><span>THE CONTEXT ENGINE</span><span>01 — 06</span></div>
    <div className="mesh-map">
      <svg className="mesh-connectors" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true"><path d="M100 60 L300 180 L500 60 M100 180 H500 M100 300 L300 180 L500 300" /></svg>
      {meshNodes.slice(0, 3).map(({ label, icon: Icon, group }) => <div key={label} className={`mesh-node ${group === active ? "is-lit" : ""}`}><Icon size={22} strokeWidth={1.3} /><span>{label}</span></div>)}
      <div className="mesh-hub"><span>Conektra</span><small>One shared context</small></div>
      {meshNodes.slice(3).map(({ label, icon: Icon, group }) => <div key={label} className={`mesh-node ${group === active ? "is-lit" : ""}`}><Icon size={22} strokeWidth={1.3} /><span>{label}</span></div>)}
    </div>
    <div className="mesh-bottom"><span className="studio-status" aria-live="polite">{statuses[active]}</span><span>Illustrative capability map</span></div>
  </div>;
}

const atlasGroups = [
  { title: "Start the connection", items: ["Conversations", "Customer context"], note: "An enquiry becomes something the team can work with." },
  { title: "Make the next step clear", items: ["Bookings", "Reminders"], note: "A service, a time and the details that belong together." },
  { title: "Carry the work forward", items: ["Billing & stock", "Follow-ups & insights"], note: "Useful context continues beyond the first interaction." },
];
export function ProductAtlas({ active }: { active: number }) {
  return <div className="product-atlas"><div className="atlas-heading"><span>PRODUCT FIELD NOTES</span><Layers size={25} strokeWidth={1.2} /></div><div className="atlas-index"><span>01</span><div><small>INDEPENDENT PRODUCT</small><strong>Connected business operations</strong></div></div><div className="atlas-rows">{atlasGroups.map((group, i) => <div key={group.title} className={active === i ? "is-current" : ""}><span>0{i + 1}</span><div><h3>{group.title}</h3><p>{group.items.join(" / ")}</p></div><ArrowRight size={18} /></div>)}</div><p className="atlas-note" aria-live="polite">{atlasGroups[active].note}</p><span className="studio-status">{statuses[active]}</span></div>;
}

/** A product lifecycle, laid out as a vertical sequence rather than a dashboard. */
export function JourneyRail({ active }: { active: number }) {
  const titles = ["A question arrives", "A plan takes shape", "The team moves together"];
  const notes = ["Intent + relevant context", "Service + confirmed time", "Responsibility + next action"];
  return <div className="journey-rail"><div className="rail-heading"><span>CONEKTRA / THE WORK IN MOTION</span><GitBranch size={21} /></div><div className="rail-track">{titles.map((title, i) => <div className={`rail-stop ${active === i ? "is-current" : ""}`} key={title}><span className="rail-number">0{i + 1}</span><div><small>{["ENQUIRY", "COMMITMENT", "CONTINUITY"][i]}</small><h3>{title}</h3><p>{notes[i]}</p></div><span className="rail-signal">{active > i ? <Check size={16} /> : active === i ? <CircleDot size={20} /> : <span />}</span></div>)}</div><div className="rail-foot"><span className="studio-status" aria-live="polite">{statuses[active]}</span><span>Illustrative journey</span></div></div>;
}

export function ConversationDiagram() {
  return <div className="routing-diagram" aria-label="Enquiry routing example"><div className="diagram-label">CONVERSATION / ROUTING THE NEXT STEP</div><div className="routing-inputs">{["Message", "Web enquiry", "Call context"].map(x => <span key={x}><MessageSquare size={15} />{x}</span>)}</div><ArrowDown className="diagram-arrow" size={25} /><div className="routing-intent"><span>UNDERSTAND THE INTENT</span><h4>A useful next action.</h4><p>Relevant details stay with the enquiry.</p></div><div className="routing-split"><div><CircleDot size={20} /><strong>Answer clearly</strong><span>When the next step is understood</span></div><div><Users size={20} /><strong>Bring in a person</strong><span>When judgement is needed</span></div></div><div className="diagram-foot">An illustrative decision path. People stay in control.</div></div>;
}
export function BookingDiagram() {
  return <div className="booking-diagram" aria-label="Booking confirmation example"><div className="diagram-label">BOOKING / FROM INTENTION TO COMMITMENT</div><div className="booking-date"><span>THE RIGHT TIME.</span><h4>A clear commitment.</h4><CalendarDays size={36} strokeWidth={1.2} /></div><div className="booking-grid" aria-hidden="true">{["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => <div key={d}><span>{d}</span>{[0, 1, 2].map(n => <i className={i === 2 && n === 1 ? "chosen" : ""} key={n}>{i === 2 && n === 1 ? <Check size={17} /> : null}</i>)}</div>)}</div><ol className="booking-checks"><li><Check size={15} /> Availability checked</li><li><Check size={15} /> Details agreed</li><li><ShieldCheck size={15} /> Confirmation communicated</li></ol><div className="diagram-foot">Illustrative sequence · confirmation follows the confirmed record.</div></div>;
}
export function OperationsDiagram() {
  return <div className="operations-diagram" aria-label="Operations handoff example"><div className="diagram-label">OPERATIONS / KEEP THE WORK MOVING</div><h4>The handoff has a history.</h4><p>Give the next person the context they need.</p><div className="operations-ledger">{[{ icon: Users, title: "Team responsibility", text: "Who owns the next step" }, { icon: Layers, title: "Service & billing", text: "What has been agreed" }, { icon: Package, title: "Stock & preparation", text: "What the work depends on" }, { icon: Send, title: "Follow-up", text: "What should happen afterwards" }].map(({ icon: Icon, title, text }, i) => <div key={title}><span>0{i + 1}</span><Icon size={21} strokeWidth={1.3} /><div><strong>{title}</strong><small>{text}</small></div><ArrowRight size={16} /></div>)}</div><div className="diagram-foot">Illustrative handoff · connected work, clear responsibility.</div></div>;
}
export function ChapterVisual({ chapter }: { chapter: number }) {
  return chapter === 0 ? <ConversationDiagram /> : chapter === 1 ? <BookingDiagram /> : <OperationsDiagram />;
}

export function IndustryScene({ industry }: { industry: number }) {
  const labels = ["Restaurant / service floor", "Salon / appointment rhythm", "Hotel / department coordination"];
  return <div className={`industry-scene industry-scene-${industry}`}><div className="diagram-label">{labels[industry]}</div>{industry === 0 ? <><h4>From reservation to service.</h4><div className="restaurant-plan" aria-label="Illustrative service zones">{["Welcome", "Dining", "Preparation", "Service"].map((label, i) => <div key={label}><span>0{i + 1}</span><CircleDot size={25} strokeWidth={1.1} /><strong>{label}</strong></div>)}</div><p>The reservation carries the relevant details to the floor.</p></> : industry === 1 ? <><h4>A schedule shaped around service.</h4><div className="salon-schedule"><div><span>CONSULTATION</span><strong>Understand the service</strong><i /></div><div><span>APPOINTMENT</span><strong>Align time & availability</strong><i /></div><div><span>CUSTOMER CARE</span><strong>Make the next visit easier</strong><i /></div></div><p>Service, availability and care share a continuous thread.</p></> : <><h4>A guest journey, across teams.</h4><div className="hotel-handoffs">{["Front desk", "Guest services", "Housekeeping"].map((label, i) => <div key={label}><span>0{i + 1}</span><Users size={22} /><strong>{label}</strong><small>{["Arrival context", "Relevant requests", "Preparation context"][i]}</small>{i < 2 && <ArrowDown size={19} />}</div>)}</div><p>Relevant arrival details support each department’s next step.</p></>}<div className="diagram-foot">Conceptual workflow · configuration varies by business.</div></div>;
}
