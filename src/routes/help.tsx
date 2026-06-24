import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import { Search, Mail } from "lucide-react";
import { toast } from "sonner";
import { helpTopics, faqs } from "@/lib/data/content";
import { PageHero } from "@/components/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help Center · GlowMate AI" }, { name: "description", content: "Guides and answers for booking artists, AI tools, timelines and your account." }] }),
  component: Help,
});

function Help() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = helpTopics.filter((t) => `${t.title} ${t.body}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHero title="Help Center" subtitle="Search guides or browse topics. We're here to help you glow." crumb="Help Center">
        <div className="flex max-w-md items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-card"><Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className="w-full bg-transparent text-sm outline-none" /></div>
      </PageHero>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const Icon = (Icons as unknown as Record<string, React.ElementType>)[t.icon] ?? Icons.HelpCircle;
            const isOpen = open === t.slug;
            return (
              <button key={t.slug} onClick={() => setOpen(isOpen ? null : t.slug)} className="rounded-3xl border border-border bg-card p-5 text-left shadow-card hover-lift">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl gradient-soft text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className={`mt-1 text-sm text-muted-foreground ${isOpen ? "" : "line-clamp-2"}`}>{t.body}</p>
                <span className="mt-2 inline-block text-xs font-medium text-primary">{isOpen ? "Show less" : "Read more"}</span>
              </button>
            );
          })}
        </div>

        <h2 className="mb-4 mt-12 font-display text-xl font-bold">FAQs</h2>
        <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card px-5 shadow-card">
          {faqs.map((f, i) => <AccordionItem key={i} value={`f${i}`}><AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent></AccordionItem>)}
        </Accordion>

        <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Contact Support</h2>
          <p className="text-sm text-muted-foreground">Email us at <a href="mailto:support@glowmate.ai" className="text-primary">support@glowmate.ai</a> or send a message below.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! We'll reply within 24h."); (e.target as HTMLFormElement).reset(); }} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required placeholder="Your name" className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <input required type="email" placeholder="Your email" className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <textarea required placeholder="How can we help?" rows={3} className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2" />
            <button className="flex items-center justify-center gap-2 rounded-full gradient-primary py-2.5 text-sm font-semibold text-primary-foreground sm:col-span-2"><Mail className="h-4 w-4" /> Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
