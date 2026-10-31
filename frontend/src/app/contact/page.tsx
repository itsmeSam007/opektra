import type { Metadata } from "next";
import { ContactExperience } from "@/components/opektra/contact-experience";
export const metadata: Metadata = { title: "Contact", description: "Discuss a product idea, ask about Opektra software or explore a partnership. Contact admin@opektra.com.", alternates: { canonical: "/contact" } };
export default function ContactPage() { return <ContactExperience />; }
