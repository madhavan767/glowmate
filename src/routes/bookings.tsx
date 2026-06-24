import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck, Search, RefreshCw, XCircle, Pencil, CalendarX2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SignInPrompt } from "@/components/SignInPrompt";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My Bookings · GlowMate AI" }, { name: "description", content: "View, reschedule, edit and cancel your bridal appointments." }] }),
  component: Bookings,
});

interface Booking { id: string; artist_name: string; artist_image: string | null; artist_id: string; service: string; booking_date: string; booking_time: string; status: string; price: number; }
const tabs = ["upcoming", "completed", "cancelled"] as const;
const times = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

function Bookings() {
  const { user } = useAuth();
  const [list, setList] = useState<Booking[]>([]);
  const [tab, setTab] = useState<typeof tabs[number]>("upcoming");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Booking | null>(null);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => { const { data } = await supabase.from("bookings").select("*").eq("user_id", user!.id).order("booking_date"); setList((data ?? []) as Booking[]); };

  const setStatus = async (id: string, status: string) => { await supabase.from("bookings").update({ status }).eq("id", id); setList((l) => l.map((b) => (b.id === id ? { ...b, status } : b))); toast.success(`Booking ${status}`); };
  const saveEdit = async () => { if (!edit) return; await supabase.from("bookings").update({ booking_date: edit.booking_date, booking_time: edit.booking_time }).eq("id", edit.id); setList((l) => l.map((b) => (b.id === edit.id ? edit : b))); setEdit(null); toast.success("Booking updated"); };

  if (!user) return <div><PageHero title="My Bookings" crumb="Bookings" /><div className="px-4 py-10"><SignInPrompt title="Sign in to view bookings" /></div></div>;

  const filtered = list.filter((b) => b.status === tab && `${b.artist_name} ${b.service}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHero title="My Bookings" subtitle="Manage all your bridal appointments in one place." crumb="Bookings" />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${tab === t ? "gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>{t} ({list.filter((b) => b.status === t).length})</button>)}
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2"><Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bookings…" className="w-full bg-transparent text-sm outline-none" /></div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={CalendarX2} title={`No ${tab} bookings`} description="Browse artists and book your perfect bridal look." action={<Link to="/artists" className="rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Find Artists</Link>} />
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div key={b.id} className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
                <img src={b.artist_image ?? ""} alt={b.artist_name} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <Link to="/artists/$id" params={{ id: b.artist_id }} className="font-semibold hover:text-primary">{b.artist_name}</Link>
                  <p className="text-sm text-primary">{b.service}</p>
                  <p className="mt-1 text-xs text-muted-foreground"><CalendarCheck className="mr-1 inline h-3.5 w-3.5" />{b.booking_date} · {b.booking_time} · ₹{b.price.toLocaleString("en-IN")}</p>
                </div>
                {b.status === "upcoming" && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setEdit(b)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <button onClick={() => setEdit(b)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent"><RefreshCw className="h-3.5 w-3.5" /> Reschedule</button>
                    <button onClick={() => setStatus(b.id, "completed")} className="rounded-full border border-emerald-300 px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50">Mark done</button>
                    <button onClick={() => setStatus(b.id, "cancelled")} className="flex items-center gap-1 rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"><XCircle className="h-3.5 w-3.5" /> Cancel</button>
                  </div>
                )}
                {b.status === "cancelled" && <Link to="/book/$id" params={{ id: b.artist_id }} className="rounded-full gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Rebook</Link>}
              </div>
            ))}
          </div>
        )}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEdit(null)}>
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-glow" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold">Edit / Reschedule</h3>
            <p className="text-sm text-muted-foreground">{edit.artist_name} · {edit.service}</p>
            <label className="mt-4 block text-xs font-medium text-muted-foreground">Date</label>
            <input type="date" min={new Date().toISOString().split("T")[0]} value={edit.booking_date} onChange={(e) => setEdit({ ...edit, booking_date: e.target.value })} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none" />
            <label className="mt-3 block text-xs font-medium text-muted-foreground">Time</label>
            <div className="mt-1 grid grid-cols-3 gap-2">{times.map((t) => <button key={t} onClick={() => setEdit({ ...edit, booking_time: t })} className={`rounded-xl border py-2 text-xs ${edit.booking_time === t ? "gradient-primary border-transparent text-primary-foreground" : "border-border"}`}>{t}</button>)}</div>
            <div className="mt-5 flex gap-2"><button onClick={() => setEdit(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm">Cancel</button><button onClick={saveEdit} className="flex-1 rounded-full gradient-primary py-2.5 text-sm font-semibold text-primary-foreground">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
