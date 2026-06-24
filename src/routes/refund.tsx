import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund Policy · GlowMate AI" }, { name: "description", content: "Our approach to cancellations and refunds." }] }),
  component: Page,
});


function Page() {
  const blocks = "We want every bride to feel confident booking through GlowMate.;Free cancellation:Cancel 72+ hours before your appointment for a full refund of any advance.;Late cancellation:Cancellations within 72 hours may incur the artist's stated fee.;Rescheduling:Reschedule for free up to 72 hours before your appointment.;Refund timeline:Eligible refunds are processed within 5–7 business days.;Disputes:Email support@glowmate.ai and we'll mediate fairly.".split(";");
  return (
    <div>
      <PageHero title="Refund Policy" subtitle="Our approach to cancellations and refunds." crumb="Refund Policy" />
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
