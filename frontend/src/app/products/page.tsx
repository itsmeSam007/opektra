import type { Metadata } from "next";
import { ProductCatalogueExperience } from "@/components/opektra/product-experience";
export const metadata: Metadata = { title: "Our products", description: "Explore thoughtful software products designed and built by Opektra, including Conektra.", alternates: { canonical: "/products" } };
export default function ProductsPage() { return <ProductCatalogueExperience />; }
