import type { MetadataRoute } from "next";
import { company } from "@/lib/opektra";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", ...(process.env.NEXT_PUBLIC_NOINDEX === "true" ? { disallow: "/" } : { allow: "/", disallow: ["/admin/", "/api/"] }) }, sitemap: `${company.url}/sitemap.xml` }; }
