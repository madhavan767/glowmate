import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({ title, subtitle, crumb, children }: { title: string; subtitle?: string; crumb?: string; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-border gradient-soft">
      <div className="pointer-events-none absolute inset-0 [background:var(--gradient-glow)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
        <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{crumb ?? title}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl animate-fade-up">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg animate-fade-up">{subtitle}</p>}
        {children && <div className="mt-6 animate-fade-up">{children}</div>}
      </div>
    </div>
  );
}
