import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAdvisorReply, suggestedQuestions } from "@/lib/advisor";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/advisor")({
  head: () => ({ meta: [
    { title: "AI Beauty Advisor · GlowMate AI" },
    { name: "description", content: "Chat with GlowMate's AI Beauty Advisor for skincare, package and bridal prep guidance." },
    { property: "og:title", content: "AI Beauty Advisor · GlowMate AI" },
    { property: "og:description", content: "Your always-on bridal beauty concierge." },
  ] }),
  component: Advisor,
});

interface Msg { id?: string; role: "user" | "assistant"; content: string }

const greeting: Msg = { role: "assistant", content: "Hi, I'm your **GlowMate Beauty Advisor** 💖\n\nI can help with skincare for your skin type, choosing packages within budget, booking timelines, makeup trials and finding the right artist. What would you like to know?" };

function Advisor() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  useEffect(() => {
    if (!user) return;
    supabase.from("advisor_messages").select("*").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data && data.length) setMsgs([greeting, ...data.map((d) => ({ id: d.id, role: d.role as "user" | "assistant", content: d.content }))]);
    });
  }, [user]);

  const persist = async (role: "user" | "assistant", content: string) => {
    if (!user) return;
    await supabase.from("advisor_messages").insert({ user_id: user.id, role, content });
  };

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", content: q }]);
    persist("user", q);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getAdvisorReply(q);
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
      persist("assistant", reply);
      setTyping(false);
    }, 700);
  };

  const clearChat = async () => {
    if (user) await supabase.from("advisor_messages").delete().eq("user_id", user.id);
    setMsgs([greeting]);
    toast("Chat cleared");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-soft"><Sparkles className="h-6 w-6" /></div>
          <div><h1 className="font-display text-xl font-bold">AI Beauty Advisor</h1><p className="text-xs text-muted-foreground">{user ? "Your chat is saved across sessions" : "Sign in to save your chat history"}</p></div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent"><Trash2 className="h-3.5 w-3.5" /> Clear</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border bg-card p-4 shadow-card">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground")}>
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-inherit dark:prose-invert"><ReactMarkdown>{m.content}</ReactMarkdown></div>
            </div>
          </motion.div>
        ))}
        {typing && <div className="flex justify-start"><div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">typing…</div></div>}
        <div ref={endRef} />
      </div>

      {msgs.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary">{s}</button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-card">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about skincare, packages, timing…" className="flex-1 bg-transparent px-4 text-sm outline-none" />
        <button type="submit" aria-label="Send" className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
