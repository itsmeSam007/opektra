import type { Metadata } from "next";
import { Journal } from "@/components/opektra/sections";
export const metadata: Metadata = { title: "Blog", description: "Product thinking, engineering and design perspectives from Opektra.", alternates: { canonical: "/blog" } };
export default function BlogPage() { return <Journal full />; }
