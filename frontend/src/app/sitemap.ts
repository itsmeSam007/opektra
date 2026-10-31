import type { MetadataRoute } from "next";
import { articles, company, products } from "@/lib/opektra";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/products", "/blog", "/contact", "/legal/privacy", "/legal/terms", ...products.map(p => `/products/${p.slug}`), ...articles.map(a => `/blog/${a.slug}`)].map(path => ({ url: `${company.url}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
