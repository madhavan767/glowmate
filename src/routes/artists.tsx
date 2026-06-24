import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { artists } from "@/lib/data/artists";
import { ArtistCard } from "@/components/ArtistCard";
import { EmptyState } from "@/components/EmptyState";
import { useWishlist } from "@/lib/useWishlist";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      { title: "Browse Bridal Artists in Delhi · GlowMate AI" },
      { name: "description", content: "Explore 30+ verified Delhi bridal makeup artists. Filter by budget, location, rating, style and availability." },
      { property: "og:title", content: "Browse Bridal Artists · GlowMate AI" },
      { property: "og:description", content: "30+ verified Delhi bridal makeup artists, filterable by budget, rating and style." },
    ],
  }),
  component: Marketplace,
});

const styleOptions = ["Glam", "Natural", "Traditional", "HD", "Airbrush", "Dewy", "Bold", "Minimal"];
const locations = Array.from(new Set(artists.map((a) => a.location)));

function Marketplace() {
  const { has, toggle } = useWishlist();
  const [q, setQ] = useState("");
  const [budget, setBudget] = useState(80000);
  const [loc, setLoc] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [style, setStyle] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = artists.filter((a) => {
      if (q && !`${a.name} ${a.specialization} ${a.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (a.price > budget) return false;
      if (loc !== "All" && a.location !== loc) return false;
      if (a.rating < minRating) return false;
      if (style !== "All" && !a.styles.includes(style)) return false;
      if (availableOnly && !a.available) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "experience") return b.experience - a.experience;
      return b.rating - a.rating;
    });
    return list;
  }, [q, budget, loc, minRating, style, availableOnly, sort]);

  const reset = () => { setQ(""); setBudget(80000); setLoc("All"); setMinRating(0); setStyle("All"); setAvailableOnly(false); };

  return (
    <div>
      <PageHero title="Delhi Bridal Artists" subtitle="Browse 30+ verified makeup artists. Filter, compare and book your perfect match." crumb="Artists" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, style or area…" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2.5 text-sm shadow-card outline-none">
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>
          <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-2 rounded-full gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} h-fit space-y-5 rounded-3xl border border-border bg-card p-5 shadow-card lg:block`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={reset} className="text-xs text-primary hover:underline">Reset</button>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Max Budget: ₹{budget.toLocaleString("en-IN")}</label>
              <input type="range" min={18000} max={80000} step={2000} value={budget} onChange={(e) => setBudget(+e.target.value)} className="mt-2 w-full accent-[var(--primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <select value={loc} onChange={(e) => setLoc(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none">
                <option>All</option>
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Minimum Rating</label>
              <div className="mt-1 flex gap-1">
                {[0, 4, 4.5, 4.8].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)} className={`flex-1 rounded-xl border px-2 py-1.5 text-xs ${minRating === r ? "gradient-primary border-transparent text-primary-foreground" : "border-border"}`}>{r === 0 ? "Any" : `${r}+`}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Style</label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {["All", ...styleOptions].map((s) => (
                  <button key={s} onClick={() => setStyle(s)} className={`rounded-full border px-2.5 py-1 text-xs ${style === s ? "gradient-primary border-transparent text-primary-foreground" : "border-border text-muted-foreground"}`}>{s}</button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-[var(--primary)]" /> Available only</label>
          </aside>

          <div>
            <p className="mb-4 text-sm text-muted-foreground">{filtered.length} artist{filtered.length !== 1 && "s"} found</p>
            {filtered.length === 0 ? (
              <EmptyState icon={X} title="No artists match your filters" description="Try widening your budget or clearing some filters." action={<button onClick={reset} className="rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Reset filters</button>} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} wishlisted={has(a.id)} onToggleWishlist={toggle} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
