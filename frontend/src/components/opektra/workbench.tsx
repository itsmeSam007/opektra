"use client";

import { ChevronRight } from "lucide-react";

export const workflowSteps = [
  { title: "Conversation", caption: "Every enquiry starts with context.", detail: "Bring customer messages and team handoffs into the same picture." },
  { title: "Booking", caption: "A conversation becomes a plan.", detail: "Keep availability, confirmation and reminders connected to the customer." },
  { title: "Operations", caption: "The context moves with the work.", detail: "Connect the service, the bill and the next customer interaction." },
];
export function WorkflowControls({ active, onChange }: { active: number; onChange: (index: number) => void }) {
  return <div className="studio-stages" aria-label="Conektra workflow stages">{workflowSteps.map((step, index) => <button type="button" key={step.title} onClick={() => onChange(index)} aria-pressed={active === index}><span>0{index + 1}</span><strong>{step.title}</strong><ChevronRight size={16} /></button>)}</div>;
}
