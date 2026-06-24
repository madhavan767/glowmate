import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Sparkles, Save, Trash2, Check, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { SignInPrompt } from "@/components/SignInPrompt";

export const Route = createFileRoute("/timeline")({
  head: () => ({ meta: [
    { title: "Wedding Timeline Planner · GlowMate AI" },
    { name: "description", content: "Generate a personalised bridal prep timeline from skin treatments to relaxation — built around your wedding date." },
    { property: "og:title", content: "Timeline Planner · GlowMate AI" },
    { property: "og:description", content: "Your day-by-day bridal glow-up plan." },
  ] }),
  component: Timeline,
});

interface Task { days: number; title: string; desc: string; date: string; done: boolean }
const template: Omit<Task, "date" | "done">[] = [
  { days: 60, title: "Skin Treatment", desc: "Start facials, peels & a glass-skin routine." },
  { days: 45, title: "Hair Spa", desc: "Deep conditioning & scalp treatment for healthy hair." },
  { days: 30, title: "Makeup Trial", desc: "Trial your bridal look with your artist." },
  { days: 15, title: "Nail Art", desc: "Manicure, pedicure & bridal nail design." },
  { days: 7, title: "Mehendi", desc: "Mehendi application & final skin clean-up." },
  { days: 1, title: "Relaxation Session", desc: "Spa, hydration & rest before the big day." },
];

function fmt(weddingDate: string, days: number) {
  const d = new Date(weddingDate); d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function Timeline() {
  const { user } = useAuth();
  const [weddingDate, setWeddingDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => {
    const { data } = await supabase.from("timelines").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (data) { setSavedId(data.id); setWeddingDate(data.wedding_date); setTasks(data.tasks as unknown as Task[]); }
  };

  const generate = () => {
    if (!weddingDate) { toast.error("Pick your wedding date first"); return; }
    setTasks(template.map((t) => ({ ...t, date: fmt(weddingDate, t.days), done: false })));
    toast.success("Prep plan generated! 📅");
  };

  const save = async () => {
    if (!user) { toast.error("Sign in to save your timeline"); return; }
    if (!tasks.length) { toast.error("Generate a plan first"); return; }
    if (savedId) {
      await supabase.from("timelines").update({ wedding_date: weddingDate, tasks: JSON.parse(JSON.stringify(tasks)) }).eq("id", savedId);
      toast.success("Timeline updated 💖");
    } else {
      const { data, error } = await supabase.from("timelines").insert({ user_id: user.id, wedding_date: weddingDate, tasks: JSON.parse(JSON.stringify(tasks)) }).select().single();
      if (error) { toast.error(error.message); return; }
      setSavedId(data.id);
      toast.success("Timeline saved 💖");
    }
  };

  const del = async () => {
    if (savedId) await supabase.from("timelines").delete().eq("id", savedId);
    setSavedId(null); setTasks([]); setWeddingDate("");
    toast("Timeline deleted");
  };

  const toggleDone = (i: number) => setTasks((t) => t.map((x, j) => (j === i ? { ...x, done: !x.done } : x)));
  const editDate = (i: number, v: string) => setTasks((t) => t.map((x, j) => (j === i ? { ...x, date: v } : x)));

  return (
    <div>
      <PageHero title="Wedding Timeline Planner" subtitle="Enter your wedding date and we'll build a day-by-day prep plan so you glow at your best." crumb="Timeline Planner" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <label className="text-xs font-medium text-muted-foreground">Wedding Date</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input type="date" min={new Date().toISOString().split("T")[0]} value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <button onClick={generate} className="flex items-center justify-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"><Sparkles className="h-4 w-4" /> Generate Plan</button>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold"><CalendarClock className="h-5 w-5 text-primary" /> Your Prep Timeline</h2>
              <div className="flex gap-2">
                <button onClick={save} className="flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Save className="h-3.5 w-3.5" /> {savedId ? "Update" : "Save"}</button>
                {savedId && <button onClick={del} className="flex items-center gap-1.5 rounded-full border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>}
              </div>
            </div>
            <div className="relative space-y-4 before:absolute before:left-[18px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-border">
              {tasks.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="relative flex gap-4 pl-1">
                  <button onClick={() => toggleDone(i)} className={`z-10 mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 ${t.done ? "gradient-primary border-transparent text-primary-foreground" : "border-primary bg-background text-primary"}`}>{t.done ? <Check className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}</button>
                  <div className="flex-1 rounded-2xl border border-border bg-card p-4 shadow-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{t.days} days before</span>
                        <h3 className={`mt-1 font-semibold ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</h3>
                      </div>
                      <input type="date" value={t.date} onChange={(e) => editDate(i, e.target.value)} className="rounded-xl border border-border bg-background px-2 py-1 text-xs outline-none" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!user && tasks.length > 0 && <div className="mt-6"><SignInPrompt title="Sign in to save your plan" description="Create an account to save, edit and revisit your timeline anytime." /></div>}
      </div>
    </div>
  );
}
