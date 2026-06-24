import { useState, useRef, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAdvisorReply, suggestedQuestions } from "@/lib/advisor";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; content: string }

export function FloatingAdvisor() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I'm your **GlowMate Beauty Advisor** 💖 Ask me anything about skincare, packages, timelines or finding the perfect artist." },
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open, typing]);

  if (pathname === "/advisor" || pathname === "/auth") return null;

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", content: getAdvisorReply(q) }]);
      setTyping(false);
    }, 650);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Beauty Advisor"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircleHeart className="h-7 w-7 animate-float" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-5 z-50 flex h-[30rem] w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-glow"
          >
            <div className="flex items-center gap-2 gradient-primary px-4 py-3 text-primary-foreground">
              <Sparkles className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Beauty Advisor</p>
                <p className="text-[11px] opacity-80">AI-powered · always on</p>
              </div>
              <Link to="/advisor" onClick={() => setOpen(false)} className="rounded-full bg-white/20 px-2 py-1 text-[11px]">Full chat</Link>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {msgs.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm", m.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground")}>
                    <div className="prose prose-sm max-w-none prose-p:my-1 dark:prose-invert"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                  </div>
                </div>
              ))}
              {typing && <div className="flex justify-start"><div className="rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">typing…</div></div>}
              <div ref={endRef} />
            </div>

            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                {suggestedQuestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary hover:text-primary">
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border p-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" className="flex-1 rounded-full bg-muted px-3 py-2 text-sm outline-none" />
              <button type="submit" aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
