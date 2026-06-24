import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, MapPin, Briefcase, Languages, Calendar, BadgeCheck, ChevronLeft, Check } from "lucide-react";
import { getArtist } from "@/lib/data/artists";
import { StarRating } from "@/components/StarRating";
import { useWishlist } from "@/lib/useWishlist";
import { faqs } from "@/lib/data/content";
import { toast } from "sonner";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/artists/$id")({
  loader: ({ params }) => {
    const artist = getArtist(params.id);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.artist.name} · Bridal Artist · GlowMate AI` },
          { name: "description", content: loaderData.artist.bio.slice(0, 155) },
          { property: "og:title", content: `${loaderData.artist.name} · GlowMate AI` },
          { property: "og:description", content: loaderData.artist.specialization },
          { property: "og:image", content: loaderData.artist.portfolio[0] },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Artist not found</h1>
      <Link to="/artists" className="mt-4 inline-block rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Browse artists</Link>
    </div>
  ),
  component: ArtistProfile,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ArtistProfile() {
  const { id } = useParams({ from: "/artists/$id" });
  const artist = getArtist(id)!;
  const { has, toggle } = useWishlist();
  const [active, setActive] = useState(0);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: artist.name, url }); } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(url); toast.success("Profile link copied!"); }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/artists" className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> Back to artists</Link>

      {/* HEADER */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-border shadow-card">
          <img src={artist.portfolio[active]} alt={artist.name} className="h-[26rem] w-full object-cover" />
          <div className="flex gap-2 overflow-x-auto bg-card p-3">
            {artist.portfolio.map((p, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 ${active === i ? "border-primary" : "border-transparent"}`}>
                <img src={p} alt="portfolio" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold">{artist.name}</h1>
              <BadgeCheck className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-1 text-sm text-primary">{artist.specialization}</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <StarRating rating={artist.rating} />
              <span className="font-semibold">{artist.rating}</span>
              <span className="text-muted-foreground">({artist.reviewsCount} reviews)</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{artist.location.replace(", Delhi", "")}</span>
              <span className="inline-flex items-center gap-2 text-muted-foreground"><Briefcase className="h-4 w-4 text-primary" />{artist.experience} yrs exp.</span>
              <span className="inline-flex items-center gap-2 text-muted-foreground"><Languages className="h-4 w-4 text-primary" />{artist.languages.join(", ")}</span>
              <span className="inline-flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-primary" />{artist.available ? "Available" : "Limited slots"}</span>
            </div>
            <div className="mt-5 rounded-2xl gradient-soft p-4">
              <span className="text-xs text-muted-foreground">Bridal package from</span>
              <p className="font-display text-3xl font-bold text-gradient">₹{artist.price.toLocaleString("en-IN")}</p>
            </div>
            <div className="mt-5 flex gap-2">
              <Link to="/book/$id" params={{ id: artist.id }} className="flex-1 rounded-full gradient-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90">Book Appointment</Link>
              <button onClick={() => toggle(artist.id)} aria-label="wishlist" className="flex h-12 w-12 items-center justify-center rounded-full border border-border hover:bg-accent"><Heart className={`h-5 w-5 ${has(artist.id) ? "fill-primary text-primary" : ""}`} /></button>
              <button onClick={share} aria-label="share" className="flex h-12 w-12 items-center justify-center rounded-full border border-border hover:bg-accent"><Share2 className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* BIO */}
      <Block title="About">
        <p className="text-sm leading-relaxed text-muted-foreground">{artist.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {artist.styles.map((s) => <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{s}</span>)}
        </div>
      </Block>

      {/* SERVICES / PRICING */}
      <Block title="Services & Pricing">
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Service</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3 text-right">Price</th></tr>
            </thead>
            <tbody>
              {artist.services.map((s) => (
                <tr key={s.name} className="border-t border-border">
                  <td className="px-4 py-3"><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.desc}</p></td>
                  <td className="px-4 py-3 text-muted-foreground">{s.duration}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gradient">₹{s.price.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      {/* AVAILABILITY */}
      <Block title="Availability This Week">
        <div className="flex flex-wrap gap-2">
          {days.map((d, i) => {
            const free = (i + artist.experience) % 3 !== 0;
            return (
              <div key={d} className={`flex w-20 flex-col items-center rounded-2xl border px-3 py-3 text-center ${free ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30" : "border-border bg-muted opacity-60"}`}>
                <span className="text-xs font-semibold">{d}</span>
                <span className={`mt-1 text-[10px] ${free ? "text-emerald-600" : "text-muted-foreground"}`}>{free ? "Open" : "Booked"}</span>
              </div>
            );
          })}
        </div>
      </Block>

      {/* REVIEWS */}
      <Block title={`Reviews (${artist.reviewsCount})`}>
        <div className="grid gap-4 md:grid-cols-3">
          {artist.reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold">{r.name}</span><StarRating rating={r.rating} size={12} /></div>
              <p className="mt-2 text-sm text-muted-foreground">“{r.text}”</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
            </motion.div>
          ))}
        </div>
      </Block>

      {/* FAQ */}
      <Block title="Frequently Asked Questions">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
          {faqs.slice(0, 4).map((f, i) => (
            <AccordionItem key={i} value={`a${i}`}><AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </Block>

      <div className="mt-8 flex items-center justify-center gap-2 rounded-3xl gradient-soft p-6 text-sm">
        <Check className="h-4 w-4 text-primary" /> Ready to glow? 
        <Link to="/book/$id" params={{ id: artist.id }} className="font-semibold text-primary hover:underline">Book {artist.name.split(" ")[0]} now →</Link>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
