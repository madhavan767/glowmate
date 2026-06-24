import { createFileRoute, Link, useParams, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, PartyPopper, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { getArtist } from "@/lib/data/artists";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { SignInPrompt } from "@/components/SignInPrompt";

export const Route = createFileRoute("/book/$id")({
  loader: ({ params }) => {
    const artist = getArtist(params.id);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `Book ${loaderData.artist.name} · GlowMate AI` : "Book · GlowMate AI" }] }),
  component: BookFlow,
});

const times = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];
const steps = ["Service", "Date", "Time", "Details", "Confirm"];

function BookFlow() {
  const { id } = useParams({ from: "/book/$id" });
  const artist = getArtist(id)!;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [service, setService] = useState(artist.services[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [contact, setContact] = useState({ name: user?.user_metadata?.full_name ?? "", phone: "", email: user?.email ?? "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (!user) return <div className="px-4 py-16"><SignInPrompt title="Sign in to book" description="Create a free account to book this artist and manage your appointments." /></div>;

  const canNext = step === 0 ? !!service : step === 1 ? !!date : step === 2 ? !!time : step === 3 ? contact.name && contact.phone : true;

  const confirm = async () => {
    setBusy(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id, artist_id: artist.id, artist_name: artist.name, artist_image: artist.image,
      service: service.name, booking_date: date, booking_time: time, status: "upcoming",
      contact_name: contact.name, contact_phone: contact.phone, contact_email: contact.email, notes: contact.notes, price: service.price,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
    confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ["#E91E63", "#C2185B", "#FFD1DC", "#FFC107"] });
    toast.success("Booking confirmed! 🎉");
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow">
          <PartyPopper className="h-10 w-10" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-bold">You're booked! 🎉</h1>
        <p className="mt-2 text-muted-foreground">{service.name} with <span className="font-semibold text-foreground">{artist.name}</span> on {date} at {time}.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/bookings" className="rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">View Bookings</Link>
          <Link to="/artists" className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-accent">Book Another</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/artists/$id" params={{ id: artist.id }} className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> Back to profile</Link>

      <div className="mb-8 flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-card">
        <img src={artist.image} alt={artist.name} className="h-14 w-14 rounded-2xl object-cover" />
        <div><h1 className="font-display text-lg font-bold">Book {artist.name}</h1><p className="text-xs text-muted-foreground">{artist.location}</p></div>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${i < step ? "gradient-primary text-primary-foreground" : i === step ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <h2 className="font-display text-xl font-bold">{["Select a Service", "Pick a Date", "Choose a Time", "Your Details", "Confirm Booking"][step]}</h2>

            {step === 0 && (
              <div className="mt-4 space-y-2">
                {artist.services.map((s) => (
                  <button key={s.name} onClick={() => setService(s)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${service.name === s.name ? "border-primary bg-accent/40" : "border-border hover:bg-accent/30"}`}>
                    <div><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.duration} · {s.desc}</p></div>
                    <span className="font-semibold text-gradient">₹{s.price.toLocaleString("en-IN")}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="mt-4">
                <input type="date" min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Choose your wedding or event date.</p>
              </div>
            )}

            {step === 2 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {times.map((t) => (
                  <button key={t} onClick={() => setTime(t)} className={`rounded-2xl border py-3 text-sm font-medium ${time === t ? "gradient-primary border-transparent text-primary-foreground" : "border-border hover:bg-accent/40"}`}>{t}</button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="mt-4 space-y-3">
                <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Full name *" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="Phone number *" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                <textarea value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} placeholder="Notes for the artist (optional)" rows={3} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
            )}

            {step === 4 && (
              <div className="mt-4 space-y-2 rounded-2xl gradient-soft p-5 text-sm">
                <Row label="Artist" value={artist.name} />
                <Row label="Service" value={service.name} />
                <Row label="Date" value={date} />
                <Row label="Time" value={time} />
                <Row label="Name" value={contact.name} />
                <Row label="Phone" value={contact.phone} />
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base"><span className="font-semibold">Total</span><span className="font-display text-xl font-bold text-gradient">₹{service.price.toLocaleString("en-IN")}</span></div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1 rounded-full border border-border px-5 py-2.5 text-sm font-medium disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Back</button>
          {step < 4 ? (
            <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="inline-flex items-center gap-1 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">Continue <ChevronRight className="h-4 w-4" /></button>
          ) : (
            <button onClick={confirm} disabled={busy} className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Sparkles className="h-4 w-4" /> {busy ? "Confirming…" : "Confirm Booking"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
