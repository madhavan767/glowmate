import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [{ title: "Cookie Policy · GlowMate AI" }, { name: "description", content: "How GlowMate AI uses cookies and local storage." }] }),
  component: Page,
});


function Page() {
  const blocks = "We use cookies and local storage to keep you signed in and remember preferences.;Essential:Required for sign-in, security and core features.;Preferences:Remember your theme (light/dark) and language.;Analytics:Help us understand how brides use GlowMate so we can improve.;Managing cookies:You can clear cookies in your browser settings at any time.".split(";");
  return (
    <div>
      <PageHero title="Cookie Policy" subtitle="How GlowMate AI uses cookies and local storage." crumb="Cookie Policy" />
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
