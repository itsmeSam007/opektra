export const SITE = {
  name: "Soumen Karmakar",
  title: "Soumen Karmakar — AI SaaS Founder",
  description:
    "Enterprise AI software products available for licensing, purchase, and acquisition by businesses worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://soumenkarmakar.com",
  founder: {
    name: "Soumen Karmakar",
    title: "Founder & CEO",
    email: "hello@soumenkarmakar.com",
    linkedin: "https://linkedin.com/in/soumenkarmakar",
    twitter: "https://twitter.com/soumenkarmakar",
    github: "https://github.com/soumenkarmakar",
  },
};

export const NAV_ITEMS = [
  { label: "Products", href: "/products" },
  { label: "Platform", href: "/products/ai-customer-operations" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Media", href: "/media" },
  { label: "Travel", href: "/travel" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Testimonials", href: "/testimonials" },
];

export const TECH_STACK = [
  { category: "Frontend", items: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"] },
  { category: "Backend", items: ["FastAPI", "Python", "SQLAlchemy", "PostgreSQL", "Redis"] },
  { category: "AI/ML", items: ["OpenAI", "LangChain", "Vector DB", "RAG", "Custom Models"] },
  { category: "Infrastructure", items: ["Docker", "AWS", "Kubernetes", "CI/CD", "Terraform"] },
  { category: "Data", items: ["PostgreSQL", "Elasticsearch", "ClickHouse", "S3", "Redis"] },
];

export const LEGAL_PAGES = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Licensing Terms", href: "/legal/licensing" },
];
