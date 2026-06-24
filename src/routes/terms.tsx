import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions · GlowMate AI" }, { name: "description", content: "The terms governing your use of GlowMate AI." }] }),
  component: Page,
});


function Page() {
  const blocks = "By using GlowMate AI you agree to these terms.;Use of service:GlowMate connects brides with independent makeup artists. We facilitate discovery and booking but the service is delivered by the artist.;Bookings:Prices shown are set by artists. Confirmations are subject to artist availability.;Conduct:Use the platform respectfully and provide accurate information.;Liability:GlowMate is not liable for services delivered by third-party artists, though we vet every artist on the platform.;Changes:We may update these terms; continued use means acceptance.".split(";");
  return (
    <div>
      <PageHero title="Terms & Conditions" subtitle="The terms governing your use of GlowMate AI." crumb="Terms & Conditions" />
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
