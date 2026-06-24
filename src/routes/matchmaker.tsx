import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, MapPin, Wand2 } from "lucide-react";
import { generateMatches, type MatchResult } from "@/lib/matchmaker";
import { skinTones, faceShapes, stylePrefs, venueTypes } from "@/lib/data/content";
import { StarRating } from "@/components/StarRating";
import { useWishlist } from "@/lib/useWishlist";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/matchmaker")({
  head: () => ({ meta: [
    { title: "AI Matchmaker · Find Your Perfect Artist · GlowMate AI" },
    { name: "description", content: "Answer a few questions and let GlowMate's AI rank your top 5 Delhi bridal artists by budget, skin tone, style and date." },
    { property: "og:title", content: "AI Bridal Matchmaker · GlowMate AI" },
    { property: "og:description", content: "Get your top 5 bridal artist matches instantly." },
  ] }),
  component: Matchmaker,
});

function Matchmaker() {
  const { has, toggle } = useWishlist();
  const [form, setForm] = useState({ budget: 45000, weddingDate: "", skinTone: skinTones[1], faceShape: faceShapes[0], style: stylePrefs[0], venue: venueTypes[0], guests: 250, age: 27 });
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(generateMatches(form));
      setLoading(false);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 1100);
  };

  return (
    <div>
      <PageHero title="Find Your Perfect Artist" subtitle="Our AI analyses your wedding details and ranks the 5 best-matched Delhi bridal artists for you." crumb="AI Matchmaker" />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Range label={`Budget: ₹${form.budget.toLocaleString("en-IN")}`} min={18000} max={90000} step={1000} value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} />
            <Input label="Wedding Date" type="date" value={form.weddingDate} onChange={(v) => setForm({ ...form, weddingDate: v })} />
            <Select label="Skin Tone" value={form.skinTone} options={skinTones} onChange={(v) => setForm({ ...form, skinTone: v })} />
            <Select label="Face Shape" value={form.faceShape} options={faceShapes} onChange={(v) => setForm({ ...form, faceShape: v })} />
            <Select label="Preferred Style" value={form.style} options={stylePrefs} onChange={(v) => setForm({ ...form, style: v })} />
            <Select label="Venue Type" value={form.venue} options={venueTypes} onChange={(v) => setForm({ ...form, venue: v })} />
            <Range label={`Guest Count: ${form.guests}`} min={50} max={800} step={25} value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} />
            <Range label={`Bride Age: ${form.age}`} min={18} max={45} step={1} value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
          </div>
          <button onClick={run} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-60">
            <Wand2 className="h-4 w-4" /> {loading ? "Analysing your matches…" : "Generate Matches"}
          </button>
        </div>

        {loading && (
          <div className="mt-8 grid gap-4">
            {[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />)}
          </div>
        )}

        <div id="results">
        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
              <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-bold"><Sparkles className="h-6 w-6 text-primary" /> Your Top 5 Matches</h2>
              <p className="mb-6 text-sm text-muted-foreground">Ranked by fit with your budget, style, skin tone and date.</p>
              <div className="space-y-4">
                {results.map((r, i) => (
                  <motion.div key={r.artist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 shadow-card hover-lift sm:flex-row">
                    <img src={r.artist.image} alt={r.artist.name} className="h-40 w-full rounded-2xl object-cover sm:h-28 sm:w-28" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{r.artist.name}</h3>
                          <p className="text-xs text-primary">{r.artist.specialization}</p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground">{r.percentage}% match</div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><StarRating rating={r.artist.rating} size={12} /> {r.artist.rating} · <MapPin className="h-3 w-3" />{r.artist.location.replace(", Delhi", "")}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{r.reason}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm">Package: <span className="font-semibold text-gradient">₹{r.packageCost.toLocaleString("en-IN")}</span></span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${r.artist.available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" : "bg-muted text-muted-foreground"}`}>{r.artist.available ? "Available" : "Limited"}</span>
                        <Link to="/book/$id" params={{ id: r.artist.id }} className="rounded-full gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Book Now</Link>
                        <button onClick={() => toggle(r.artist.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><Heart className={`h-4 w-4 ${has(r.artist.id) ? "fill-primary text-primary" : ""}`} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" /></label>;
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
}
function Range({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground">{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-3 w-full accent-[var(--primary)]" /></label>;
}
