import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { SignInPrompt } from "@/components/SignInPrompt";
import { skinTones } from "@/lib/data/content";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile · GlowMate AI" }, { name: "description", content: "Manage your GlowMate profile and beauty preferences." }] }),
  component: Profile,
});

interface P { full_name: string; email: string; phone: string; city: string; wedding_date: string; skin_tone: string; preferences: string; }
const empty: P = { full_name: "", email: "", phone: "", city: "Delhi", wedding_date: "", skin_tone: skinTones[1], preferences: "" };

function Profile() {
  const { user } = useAuth();
  const [p, setP] = useState<P>(empty);
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
    if (data) setP({ full_name: data.full_name ?? "", email: data.email ?? user!.email ?? "", phone: data.phone ?? "", city: data.city ?? "Delhi", wedding_date: data.wedding_date ?? "", skin_tone: data.skin_tone ?? skinTones[1], preferences: data.preferences ?? "" });
  };
  const save = async () => {
    await supabase.from("profiles").upsert({ user_id: user!.id, ...p, wedding_date: p.wedding_date || null }, { onConflict: "user_id" });
    setEditing(false); toast.success("Profile saved 💖");
  };

  if (!user) return <div><PageHero title="My Profile" crumb="Profile" /><div className="px-4 py-10"><SignInPrompt title="Sign in to view your profile" /></div></div>;

  return (
    <div>
      <PageHero title="My Profile" subtitle="Keep your details fresh for smarter AI matches." crumb="Profile" />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-3xl font-bold text-primary-foreground">{(p.full_name || p.email || "G")[0].toUpperCase()}</div>
            <div className="flex-1"><h2 className="font-display text-xl font-bold">{p.full_name || "Your name"}</h2><p className="text-sm text-muted-foreground">{p.email}</p></div>
            <button onClick={() => (editing ? save() : setEditing(true))} className="flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{editing ? <><Save className="h-4 w-4" /> Save</> : <><Pencil className="h-4 w-4" /> Edit</>}</button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" value={p.full_name} editing={editing} onChange={(v) => setP({ ...p, full_name: v })} />
            <Field label="Phone" value={p.phone} editing={editing} onChange={(v) => setP({ ...p, phone: v })} />
            <Field label="City" value={p.city} editing={editing} onChange={(v) => setP({ ...p, city: v })} />
            <Field label="Wedding Date" type="date" value={p.wedding_date} editing={editing} onChange={(v) => setP({ ...p, wedding_date: v })} />
            <div><label className="text-xs font-medium text-muted-foreground">Skin Tone</label>{editing ? <select value={p.skin_tone} onChange={(e) => setP({ ...p, skin_tone: e.target.value })} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none">{skinTones.map((s) => <option key={s}>{s}</option>)}</select> : <p className="mt-1 rounded-2xl bg-muted px-4 py-2.5 text-sm">{p.skin_tone}</p>}</div>
          </div>
          <div className="mt-4"><label className="text-xs font-medium text-muted-foreground">Beauty Preferences</label>{editing ? <textarea value={p.preferences} onChange={(e) => setP({ ...p, preferences: e.target.value })} rows={3} placeholder="e.g. natural dewy looks, no heavy contour…" className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none" /> : <p className="mt-1 rounded-2xl bg-muted px-4 py-2.5 text-sm">{p.preferences || "—"}</p>}</div>
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, editing, onChange, type = "text" }: { label: string; value: string; editing: boolean; onChange: (v: string) => void; type?: string }) {
  return <div><label className="text-xs font-medium text-muted-foreground">{label}</label>{editing ? <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" /> : <p className="mt-1 rounded-2xl bg-muted px-4 py-2.5 text-sm">{value || "—"}</p>}</div>;
}
