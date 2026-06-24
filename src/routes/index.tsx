import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, MessageCircleHeart, Search, CalendarClock, Gift, ShieldCheck, Star, ChevronRight } from "lucide-react";
import heroBride from "@/assets/hero-bride.jpg";
import { artists } from "@/lib/data/artists";
import { testimonials, successStories, faqs } from "@/lib/data/content";
import { ArtistCard } from "@/components/ArtistCard";
import { StarRating } from "@/components/StarRating";
import { useWishlist } from "@/lib/useWishlist";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlowMate AI — Find Your Perfect Bridal Artist in Minutes" },
      { name: "description", content: "AI bridal matchmaker for Delhi brides. Discover artists curated for your wedding style, skin tone and budget. Book makeup, plan your timeline and build packages." },
      { property: "og:title", content: "GlowMate AI — AI Bridal Matchmaker" },
      { property: "og:description", content: "Discover bridal artists curated for your wedding style, skin tone and budget." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1595872018818-97555653a011?w=1200&q=80" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Sparkles, title: "AI Matchmaker", desc: "Top 5 artists ranked for your skin tone, budget & date." },
  { icon: MessageCircleHeart, title: "AI Beauty Advisor", desc: "Instant answers on skincare, packages & prep." },
  { icon: CalendarClock, title: "Timeline Planner", desc: "A day-by-day glow-up plan from 60 days out." },
  { icon: Gift, title: "Smart Packages", desc: "Bundle the whole family and unlock savings." },
];

function Landing() {
  const { has, toggle } = useWishlist();
  const trending = artists.filter((a) => a.trending).slice(0, 8);
  const topRated = [...artists].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [background:var(--gradient-glow)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Delhi's #1 AI Bridal Concierge
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              AI Bridal <span className="text-gradient">Matchmaker</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              Discover bridal artists curated specifically for your wedding style, skin tone and budget — booked in minutes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/matchmaker" className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">
                <Search className="h-4 w-4" /> Find Artist
              </Link>
              <Link to="/advisor" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent">
                <MessageCircleHeart className="h-4 w-4 text-primary" /> Talk to AI
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div><p className="font-display text-2xl font-bold text-gradient">30+</p><p className="text-muted-foreground">Verified Artists</p></div>
              <div><p className="font-display text-2xl font-bold text-gradient">4.8★</p><p className="text-muted-foreground">Avg. Rating</p></div>
              <div><p className="font-display text-2xl font-bold text-gradient">2k+</p><p className="text-muted-foreground">Happy Brides</p></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-accent/60 blur-2xl" />
            <img src={heroBride} alt="Radiant bride in bridal makeup" width={1280} height={1600} className="relative w-full rounded-[2rem] object-cover shadow-glow" />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl glass p-3 shadow-soft">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div><p className="text-xs font-semibold">Verified Artists</p><p className="text-[11px] text-muted-foreground">Portfolio reviewed</p></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl border border-border bg-card p-6 shadow-card hover-lift">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl gradient-soft text-primary"><f.icon className="h-6 w-6" /></div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <Section title="Trending Artists" subtitle="The most-booked bridal artists in Delhi right now" link="/artists">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} wishlisted={has(a.id)} onToggleWishlist={toggle} />)}
        </div>
      </Section>

      {/* TOP RATED */}
      <Section title="Top Rated Artists" subtitle="Five-star talent loved by Delhi brides" link="/artists">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topRated.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} wishlisted={has(a.id)} onToggleWishlist={toggle} />)}
        </div>
      </Section>

      {/* POPULAR PACKAGES */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHead title="Popular Packages" subtitle="Curated bundles that save you time and money" link="/packages" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Bridal Essential", price: 32000, save: 6000, items: ["Bridal HD Makeup", "Hair Styling", "Draping", "Trial Session"] },
            { name: "Bride + Family", price: 58000, save: 14000, items: ["Bridal Makeup", "Mother of Bride", "2 Bridesmaids", "Hair for all"], featured: true },
            { name: "Complete Wedding", price: 92000, save: 24000, items: ["Engagement", "Bridal Day", "Reception", "Family of 4"] },
          ].map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl border p-6 shadow-card hover-lift ${p.featured ? "gradient-primary border-transparent text-primary-foreground" : "border-border bg-card"}`}>
              {p.featured && <span className="absolute right-5 top-5 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold">Most Popular</span>}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className={`mt-3 font-display text-3xl font-bold ${p.featured ? "" : "text-gradient"}`}>₹{p.price.toLocaleString("en-IN")}</p>
              <p className={`text-xs ${p.featured ? "opacity-90" : "text-muted-foreground"}`}>Save ₹{p.save.toLocaleString("en-IN")}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.items.map((it) => <li key={it} className="flex items-center gap-2"><Star className={`h-3.5 w-3.5 ${p.featured ? "fill-white text-white" : "fill-[var(--gold)] text-[var(--gold)]"}`} />{it}</li>)}
              </ul>
              <Link to="/packages" className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-semibold ${p.featured ? "bg-white text-primary" : "gradient-primary text-primary-foreground"}`}>Build Package</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="gradient-soft py-12">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead title="Success Stories" subtitle="Real Delhi brides, real glow-ups" />
          <div className="grid gap-5 md:grid-cols-3">
            {successStories.map((s, i) => (
              <motion.article key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card hover-lift">
                <img src={s.image} alt={s.title} loading="lazy" className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                  <p className="mt-3 text-xs font-medium text-primary">— {s.bride}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHead title="Loved by Brides" subtitle="What our community says about GlowMate" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <StarRating rating={t.rating} />
              <p className="mt-3 text-sm text-muted-foreground">“{t.text}”</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={t.image} alt={t.name} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                <div><p className="text-sm font-semibold">{t.name}</p><p className="text-[11px] text-muted-foreground">{t.role}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <SectionHead title="Frequently Asked Questions" subtitle="Everything you need to know" />
        <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card px-5 shadow-card">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="relative overflow-hidden rounded-[2rem] gradient-primary px-6 py-14 text-center text-primary-foreground shadow-glow">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_70%_30%,white,transparent_50%)]" />
          <h2 className="relative font-display text-3xl font-bold md:text-4xl">Your dream bridal look starts here</h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-90">Let our AI find your perfect artist and plan your glow-up — completely free.</p>
          <Link to="/matchmaker" className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary hover:opacity-90">
            Start Matching <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ title, subtitle, link }: { title: string; subtitle: string; link?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {link && <Link to={link} className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">View all <ChevronRight className="h-4 w-4" /></Link>}
    </div>
  );
}

function Section({ title, subtitle, link, children }: { title: string; subtitle: string; link?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHead title={title} subtitle={subtitle} link={link} />
      {children}
    </section>
  );
}
