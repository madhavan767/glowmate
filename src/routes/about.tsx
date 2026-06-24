import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us · GlowMate AI" }, { name: "description", content: "GlowMate AI is Delhi's AI bridal beauty concierge, matching brides with verified makeup artists." }, { property: "og:title", content: "About GlowMate AI" }, { property: "og:description", content: "Delhi's AI bridal beauty concierge." }] }),
  component: About,
});

const values = [
  { icon: Sparkles, title: "AI-First", desc: "Smart matching that understands your skin tone, style and budget." },
  { icon: ShieldCheck, title: "Verified Talent", desc: "Every artist is portfolio-reviewed with real bride ratings." },
  { icon: Heart, title: "Bride-Centric", desc: "Tools built around your wedding journey, not the other way around." },
  { icon: Users, title: "Community", desc: "2,000+ Delhi brides who found their glow with us." },
];

function About() {
  return (
    <div>
      <PageHero title="About GlowMate AI" subtitle="We're on a mission to make every Delhi bride feel effortlessly radiant on her big day." crumb="About Us" />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-lg leading-relaxed text-muted-foreground">Finding the right bridal artist used to mean endless Instagram scrolling, unreliable referrals and clashing budgets. GlowMate AI changes that. We combine a curated marketplace of verified Delhi artists with AI matchmaking, prep planning and packaging tools — so you can go from overwhelmed to booked in minutes.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-3xl border border-border bg-card p-5 shadow-card hover-lift"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl gradient-soft text-primary"><v.icon className="h-5 w-5" /></div><h3 className="font-semibold">{v.title}</h3><p className="mt-1 text-sm text-muted-foreground">{v.desc}</p></div>
          ))}
        </div>
        <div className="mt-12 rounded-3xl gradient-primary p-8 text-center text-primary-foreground shadow-glow">
          <h2 className="font-display text-2xl font-bold">Ready to find your perfect artist?</h2>
          <Link to="/matchmaker" className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary">Try AI Matchmaker</Link>
        </div>
      </div>
    </div>
  );
}
