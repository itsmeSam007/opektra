import { AdminAuthProvider } from "@/components/admin/admin-auth-provider";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
