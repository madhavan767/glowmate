import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Save, Trash2, Download, Check, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SignInPrompt } from "@/components/SignInPrompt";

export const Route = createFileRoute("/packages")({
  head: () => ({ meta: [
    { title: "Bridal Package Generator · GlowMate AI" },
    { name: "description", content: "Build a custom bridal beauty package for the bride, mother, bridesmaids, engagement and reception — and unlock instant savings." },
    { property: "og:title", content: "Package Generator · GlowMate AI" },
    { property: "og:description", content: "Bundle bridal services and save." },
  ] }),
  component: Packages,
});

interface SvcDef { key: string; label: string; price: number; count?: boolean }
const defs: SvcDef[] = [
  { key: "bride", label: "Bride — Bridal HD Makeup & Hair", price: 35000 },
  { key: "mother", label: "Mother of the Bride Makeup", price: 12000 },
  { key: "bridesmaids", label: "Bridesmaids Makeup (each)", price: 8000, count: true },
  { key: "engagement", label: "Engagement Makeup", price: 18000 },
  { key: "reception", label: "Reception Glam", price: 22000 },
];

interface Generated { name: string; services: { name: string; price: number }[]; price: number; savings: number; timeline: string }
interface SavedPkg extends Generated { id: string }

function Packages() {
  const { user } = useAuth();
  const [sel, setSel] = useState<Record<string, number>>({ bride: 1 });
  const [gen, setGen] = useState<Generated | null>(null);
  const [saved, setSaved] = useState<SavedPkg[]>([]);

  useEffect(() => { if (user) loadSaved(); }, [user]);
  const loadSaved = async () => {
    const { data } = await supabase.from("saved_packages").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setSaved((data ?? []).map((d) => ({ id: d.id, name: d.name, services: d.services as { name: string; price: number }[], price: d.price, savings: d.savings, timeline: d.timeline ?? "" })));
  };

  const toggle = (key: string, count?: boolean) => {
    setSel((s) => {
      const next = { ...s };
      if (count) { next[key] = Math.min((next[key] ?? 0) + 1, 8); }
      else { if (next[key]) delete next[key]; else next[key] = 1; }
      return next;
    });
  };
  const dec = (key: string) => setSel((s) => { const n = { ...s }; if (n[key] > 1) n[key]--; else delete n[key]; return n; });

  const generate = () => {
    const services: { name: string; price: number }[] = [];
    defs.forEach((d) => { const c = sel[d.key]; if (c) services.push({ name: d.count ? `${d.label.replace(" (each)", "")} ×${c}` : d.label, price: d.price * c }); });
    if (!services.length) { toast.error("Select at least one service"); return; }
    const subtotal = services.reduce((a, s) => a + s.price, 0);
    const rate = services.length >= 4 ? 0.18 : services.length >= 3 ? 0.12 : services.length >= 2 ? 0.07 : 0;
    const savings = Math.round(subtotal * rate);
    const timeline = "Trial 30 days before · Final services on event days · Touch-up kit included";
    setGen({ name: `${services.length}-Service Bridal Package`, services, price: subtotal - savings, savings, timeline });
    toast.success("Package generated! 🎁");
    setTimeout(() => document.getElementById("gen")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const savePkg = async () => {
    if (!user) { toast.error("Sign in to save packages"); return; }
    if (!gen) return;
    const { error } = await supabase.from("saved_packages").insert({ user_id: user.id, name: gen.name, members: Object.keys(sel), services: gen.services, price: gen.price, savings: gen.savings, timeline: gen.timeline });
    if (error) { toast.error(error.message); return; }
    toast.success("Package saved 💖");
    loadSaved();
  };

  const del = async (id: string) => { await supabase.from("saved_packages").delete().eq("id", id); setSaved((p) => p.filter((x) => x.id !== id)); toast("Package deleted"); };

  const downloadPDF = (pkg: Generated) => {
    const win = window.open("", "_blank");
    if (!win) { toast.error("Allow pop-ups to download"); return; }
    win.document.write(`<html><head><title>${pkg.name}</title><style>body{font-family:Georgia,serif;padding:40px;color:#2B2B2B}h1{color:#E91E63}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{padding:10px;border-bottom:1px solid #eee;text-align:left}.tot{color:#E91E63;font-size:22px;font-weight:bold}</style></head><body><h1>GlowMate AI</h1><h2>${pkg.name}</h2><table><tr><th>Service</th><th style="text-align:right">Price</th></tr>${pkg.services.map((s) => `<tr><td>${s.name}</td><td style="text-align:right">₹${s.price.toLocaleString("en-IN")}</td></tr>`).join("")}<tr><td>Bundle Savings</td><td style="text-align:right;color:green">- ₹${pkg.savings.toLocaleString("en-IN")}</td></tr></table><p class="tot">Total: ₹${pkg.price.toLocaleString("en-IN")}</p><p>${pkg.timeline}</p><p style="margin-top:30px;color:#888">Generated by GlowMate AI · support@glowmate.ai</p></body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div>
      <PageHero title="Bridal Package Generator" subtitle="Bundle services for the whole wedding party and unlock automatic savings." crumb="Packages" />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Gift className="h-5 w-5 text-primary" /> Choose services</h2>
            <div className="mt-4 space-y-2">
              {defs.map((d) => {
                const c = sel[d.key];
                return (
                  <div key={d.key} className={`flex items-center justify-between rounded-2xl border p-3 ${c ? "border-primary bg-accent/40" : "border-border"}`}>
                    <button onClick={() => toggle(d.key, d.count)} className="flex flex-1 items-center gap-3 text-left">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${c ? "gradient-primary border-transparent text-primary-foreground" : "border-border"}`}>{c ? <Check className="h-4 w-4" /> : null}</span>
                      <span><span className="text-sm font-medium">{d.label}</span><span className="block text-xs text-muted-foreground">₹{d.price.toLocaleString("en-IN")}{d.count ? " each" : ""}</span></span>
                    </button>
                    {d.count && c ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => dec(d.key)} className="flex h-7 w-7 items-center justify-center rounded-full border border-border"><Minus className="h-3 w-3" /></button>
                        <span className="w-5 text-center text-sm font-semibold">{c}</span>
                        <button onClick={() => toggle(d.key, true)} className="flex h-7 w-7 items-center justify-center rounded-full border border-border"><Plus className="h-3 w-3" /></button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <button onClick={generate} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"><Sparkles className="h-4 w-4" /> Generate Package</button>
          </div>

          <div id="gen">
            <AnimatePresence mode="wait">
              {gen ? (
                <motion.div key="gen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-display text-xl font-bold">{gen.name}</h3>
                  <div className="mt-4 space-y-2">
                    {gen.services.map((s) => <div key={s.name} className="flex justify-between text-sm"><span className="text-muted-foreground">{s.name}</span><span className="font-medium">₹{s.price.toLocaleString("en-IN")}</span></div>)}
                    <div className="flex justify-between text-sm text-emerald-600"><span>Bundle savings</span><span>- ₹{gen.savings.toLocaleString("en-IN")}</span></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4"><span className="font-semibold">Total</span><span className="font-display text-2xl font-bold text-gradient">₹{gen.price.toLocaleString("en-IN")}</span></div>
                  <p className="mt-3 rounded-xl gradient-soft p-3 text-xs text-muted-foreground">⏱ {gen.timeline}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={savePkg} className="flex flex-1 items-center justify-center gap-1.5 rounded-full gradient-primary py-2.5 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save</button>
                    <button onClick={() => downloadPDF(gen)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-accent"><Download className="h-4 w-4" /> PDF</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="flex h-full items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">Select services and generate your custom package.</motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SAVED */}
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold">Saved Packages</h2>
          {!user ? (
            <SignInPrompt title="Sign in to save packages" description="Create an account to save and download your bridal packages." />
          ) : saved.length === 0 ? (
            <EmptyState icon={Gift} title="No saved packages yet" description="Generate a package above and tap Save to keep it here." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {saved.map((p) => (
                <div key={p.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{p.name}</h3>
                    <span className="font-display text-lg font-bold text-gradient">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{p.services.map((s) => <li key={s.name}>• {s.name}</li>)}</ul>
                  <p className="mt-2 text-xs text-emerald-600">Saved ₹{p.savings.toLocaleString("en-IN")}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => downloadPDF(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs font-semibold hover:bg-accent"><Download className="h-3.5 w-3.5" /> PDF</button>
                    <button onClick={() => del(p.id)} className="flex items-center justify-center gap-1.5 rounded-full border border-destructive/40 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
