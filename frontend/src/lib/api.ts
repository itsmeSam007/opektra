import { fetchAPI } from "@/lib/api-base";

export { fetchAPI };

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: { title: string; description: string; icon: string }[];
  domains: string[];
  architecture: { layers: { name: string; components: string[] }[] };
  screenshots: string[];
  is_flagship: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  tags: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: { label: string; value: string }[];
  cover_image: string | null;
  related_product_slug: string | null;
  gallery_images: { url: string; alt: string }[];
  is_published: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url: string | null;
}

export interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string;
  image_url: string | null;
  project_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface TravelEntry {
  id: number;
  slug: string;
  title: string;
  location_name: string;
  country_code: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  gallery_images: { url: string; alt: string; caption?: string }[];
  visited_at: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  is_published: boolean;
  sort_order: number;
  items: { id: number; url: string; alt_text: string; caption: string; sort_order: number }[];
}

export interface PublicSettings {
  module_travel_enabled: boolean;
  module_media_enabled: boolean;
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  url: string;
}

export const api = {
  products: {
    list: () => fetchAPI<Product[]>("/products"),
    get: (slug: string) => fetchAPI<Product>(`/products/${slug}`),
  },
  blog: {
    list: () => fetchAPI<BlogPost[]>("/blog"),
    get: (slug: string) => fetchAPI<BlogPost>(`/blog/${slug}`),
  },
  caseStudies: {
    list: () => fetchAPI<CaseStudy[]>("/case-studies"),
    get: (slug: string) => fetchAPI<CaseStudy>(`/case-studies/${slug}`),
  },
  testimonials: {
    list: () => fetchAPI<Testimonial[]>("/testimonials"),
  },
  portfolio: {
    list: (path = "/portfolio") => fetchAPI<PortfolioItem[]>(path),
    get: (slug: string) => fetchAPI<PortfolioItem>(`/portfolio/${slug}`),
  },
  travel: {
    list: (path = "/travel") => fetchAPI<TravelEntry[]>(path),
    get: (slug: string) => fetchAPI<TravelEntry>(`/travel/${slug}`),
  },
  galleries: {
    list: () => fetchAPI<GalleryAlbum[]>("/galleries"),
    get: (slug: string) => fetchAPI<GalleryAlbum>(`/galleries/${slug}`),
  },
  settings: {
    public: () => fetchAPI<PublicSettings>("/settings/public"),
  },
  github: {
    repos: () => fetchAPI<GitHubRepo[]>("/integrations/github/repos"),
    stats: () => fetchAPI<{ public_repos: number; followers: number }>("/integrations/github/stats"),
  },
  youtube: {
    videos: () => fetchAPI<YouTubeVideo[]>("/integrations/youtube/videos"),
  },
  contact: {
    submit: (data: Record<string, string>) =>
      fetchAPI<{ ok: boolean; message: string }>("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  inquiries: {
    submit: (data: Record<string, string | boolean>) =>
      fetchAPI<{ ok: boolean; message: string }>("/inquiries", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  search: {
    query: (q: string) => fetchAPI<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`),
  },
  newsletter: {
    subscribe: (email: string) =>
      fetchAPI<{ ok: boolean; message: string }>("/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email, consent: true, website: "" }),
      }),
  },
};

export interface SearchResult {
  type: string;
  title: string;
  slug: string;
  excerpt: string;
  url: string;
}
