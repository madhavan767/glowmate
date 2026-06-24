import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Brush, CalendarCheck, Gift, Plus, Pencil, Trash2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { artists } from "@/lib/data/artists";
import { testimonials, faqs } from "@/lib/data/content";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard · GlowMate AI" }, { name: "description", content: "Manage artists, reviews, testimonials and FAQs." }] }),
  component: Admin,
});

const stats = [
  { label: "Users", value: "2,148", icon: Users, change: "+12%" },
  { label: "Artists", value: String(artists.length), icon: Brush, change: "+3" },
  { label: "Bookings", value: "874", icon: CalendarCheck, change: "+24%" },
  { label: "Packages", value: "312", icon: Gift, change: "+8%" },
];

function Admin() {
  const [tab, setTab] = useState<"artists" | "reviews" | "faqs" | "testimonials">("artists");
  return (
    <div>
      <PageHero title="Admin Dashboard" subtitle="Operational overview & content management." crumb="Admin" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-soft text-primary"><s.icon className="h-5 w-5" /></div><span className="text-xs font-semibold text-emerald-600">{s.change}</span></div>
              <p className="mt-3 font-display text-2xl font-bold">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-1 rounded-full border border-border bg-card p-1">
          {([["artists", "Manage Artists"], ["reviews", "Reviews"], ["testimonials", "Testimonials"], ["faqs", "FAQs"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === k ? "gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>{label}</button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "artists" && (
            <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
              <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Artists ({artists.length})</h2><button onClick={() => toast.success("Add Artist form opened")} className="flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add Artist</button></div>
              <div className="max-h-[28rem] divide-y divide-border overflow-y-auto">
                {artists.slice(0, 14).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 py-3"><img src={a.image} alt={a.name} className="h-10 w-10 rounded-xl object-cover" /><div className="flex-1"><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.specialization} · ₹{a.price.toLocaleString("en-IN")}</p></div><span className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)]" />{a.rating}</span><button onClick={() => toast("Edit artist")} className="rounded-full border border-border p-1.5"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => toast("Artist removed")} className="rounded-full border border-destructive/40 p-1.5 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div>
                ))}
              </div>
            </div>
          )}
          {tab === "reviews" && (
            <div className="space-y-3">{artists.slice(0, 6).flatMap((a) => a.reviews.slice(0, 1).map((r, i) => (
              <div key={a.id + i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card"><div><p className="text-sm font-medium">{r.name} → {a.name}</p><p className="text-xs text-muted-foreground">"{r.text.slice(0, 70)}…"</p></div><button onClick={() => toast("Review removed")} className="rounded-full border border-destructive/40 p-2 text-destructive"><Trash2 className="h-4 w-4" /></button></div>
            )))}</div>
          )}
          {tab === "testimonials" && (
            <div className="space-y-3">{testimonials.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card"><div className="flex items-center gap-3"><img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" /><div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div></div><div className="flex gap-1"><button onClick={() => toast("Edit testimonial")} className="rounded-full border border-border p-2"><Pencil className="h-4 w-4" /></button><button onClick={() => toast("Removed")} className="rounded-full border border-destructive/40 p-2 text-destructive"><Trash2 className="h-4 w-4" /></button></div></div>
            ))}<button onClick={() => toast.success("Add testimonial")} className="flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add Testimonial</button></div>
          )}
          {tab === "faqs" && (
            <div className="space-y-3">{faqs.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card"><p className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4 text-primary" />{f.q}</p><div className="flex gap-1"><button onClick={() => toast("Edit FAQ")} className="rounded-full border border-border p-2"><Pencil className="h-4 w-4" /></button><button onClick={() => toast("Removed")} className="rounded-full border border-destructive/40 p-2 text-destructive"><Trash2 className="h-4 w-4" /></button></div></div>
            ))}<button onClick={() => toast.success("Add FAQ")} className="flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add FAQ</button></div>
          )}
        </div>
      </div>
    </div>
  );
}
