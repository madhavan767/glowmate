import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { guideSteps } from "@/lib/data/content";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/guide")({
  head: () => ({ meta: [{ title: "User Guide · GlowMate AI" }, { name: "description", content: "A step-by-step guide to getting the most out of GlowMate AI." }] }),
  component: Guide,
});

function Guide() {
  return (
    <div>
      <PageHero title="How GlowMate Works" subtitle="From sign-up to your wedding day glow in seven simple steps." crumb="User Guide" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-5">
          {guideSteps.map((s, i) => {
            const Icon = (Icons as unknown as Record<string, React.ElementType>)[s.icon] ?? Icons.Circle;
            return (
              <motion.div key={s.step} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-card hover-lift">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground"><Icon className="h-6 w-6" /></div>
                <div><span className="text-xs font-semibold text-primary">Step {s.step}</span><h3 className="font-display text-lg font-bold">{s.title}</h3><p className="mt-1 text-sm text-muted-foreground">{s.desc}</p></div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-10 text-center"><Link to="/matchmaker" className="inline-flex rounded-full gradient-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow">Get Started Now</Link></div>
      </div>
    </div>
  );
}
