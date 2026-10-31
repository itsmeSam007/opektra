import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-20 lg:py-28", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  description,
  className,
}: {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {label && (
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">{label}</p>
      )}
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-4 md:px-6", className)}>{children}</div>;
}
