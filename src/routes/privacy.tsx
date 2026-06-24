import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy · GlowMate AI" }, { name: "description", content: "How GlowMate AI collects, uses and protects your data." }] }),
  component: Page,
});


function Page() {
  const blocks = "We collect only the information needed to power your bridal planning — your name, contact details, wedding preferences and bookings. Your data is stored securely and never sold to third parties.;What we collect:Account details, profile preferences, bookings, wishlists and saved plans you create.;How we use it:To personalise AI matches, manage bookings and improve our service.;Your rights:You can edit or delete your data anytime from Settings. Contact support@glowmate.ai for full data removal.;Security:Data is encrypted in transit and protected with row-level access controls.".split(";");
  return (
    <div>
      <PageHero title="Privacy Policy" subtitle="How GlowMate AI collects, uses and protects your data." crumb="Privacy Policy" />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-10">
        <p className="text-xs text-muted-foreground">Last updated: June 2026</p>
        {blocks.map((b, i) => {
          const [h, body] = b.split(":");
          return (
            <div key={i} className="rounded-3xl border border-border bg-card p-5 shadow-card">
              {body ? <h2 className="font-display text-lg font-bold">{h}</h2> : null}
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body ?? h}</p>
            </div>
          );
        })}
        <p className="text-sm text-muted-foreground">Questions? Email <a href="mailto:support@glowmate.ai" className="text-primary">support@glowmate.ai</a>.</p>
      </div>
    </div>
  );
}
