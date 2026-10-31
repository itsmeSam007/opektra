import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  FileText,
  Image,
  LayoutDashboard,
  ScrollText,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission: string | null;
}

/** Eleven admin sections per Sprint 7 spec. */
export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: null },
  { label: "Users", href: "/admin/users", icon: Users, permission: "users:read" },
  { label: "Roles", href: "/admin/roles", icon: Shield, permission: "roles:read" },
  { label: "Permissions", href: "/admin/permissions", icon: Shield, permission: "roles:read" },
  { label: "Content", href: "/admin/content", icon: FileText, permission: "cms:read" },
  { label: "Media", href: "/admin/media", icon: Image, permission: "media:read" },
  { label: "SEO", href: "/admin/seo", icon: Search, permission: "settings:read" },
  { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings:read" },
  { label: "Logs", href: "/admin/logs", icon: ScrollText, permission: "audit:read" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "analytics:read" },
  { label: "Monitoring", href: "/admin/monitoring", icon: Activity, permission: "monitoring:read" },
];

export const CONTENT_MODULES = [
  { label: "Products", href: "/admin/products", permission: "products:read" },
  { label: "Blog", href: "/admin/blog", permission: "blog:read" },
  { label: "Portfolio", href: "/admin/portfolio", permission: "portfolio:read" },
  { label: "Case Studies", href: "/admin/case-studies", permission: "case_studies:read" },
  { label: "Testimonials", href: "/admin/testimonials", permission: "testimonials:read" },
  { label: "Travel", href: "/admin/travel", permission: "travel:read" },
  { label: "Inquiries", href: "/admin/inquiries", permission: "inquiries:read" },
  { label: "Contact Inbox", href: "/admin/contacts", permission: "contact:read" },
];

export function canAccess(permissions: string[], required: string | null): boolean {
  if (!required) return true;
  return permissions.includes(required);
}
