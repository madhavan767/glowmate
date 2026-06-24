import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";
import heroBride from "@/assets/hero-bride.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in · GlowMate AI" }, { name: "description", content: "Sign in or create your free GlowMate AI account." }] }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to GlowMate 💖");
        navigate({ to: "/profile" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created! Welcome to GlowMate 💖");
        navigate({ to: "/profile" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("Password reset link sent — check your inbox.");
        setMode("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed. Try again."); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: "/profile" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroBride} alt="Bride" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-primary/20 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-sm text-white">
          <h2 className="font-display text-3xl font-bold">Your perfect bridal artist, matched by AI.</h2>
          <p className="mt-2 opacity-90">Join 2,000+ Delhi brides who found their glow with GlowMate.</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-5 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back home</Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="GlowMate AI" className="h-10 w-10" />
            <span className="font-display text-2xl font-bold text-gradient">GlowMate AI</span>
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to manage bookings & matches." : mode === "signup" ? "Free forever. No card required." : "We'll email you a reset link."}
          </p>

          {mode !== "forgot" && (
            <>
              <button onClick={google} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-60">
                <GoogleIcon /> Continue with Google
              </button>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={<Sparkles className="h-4 w-4" />}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className="w-full bg-transparent text-sm outline-none" />
              </Field>
            )}
            <Field icon={<Mail className="h-4 w-4" />}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" required className="w-full bg-transparent text-sm outline-none" />
            </Field>
            {mode !== "forgot" && (
              <Field icon={<Lock className="h-4 w-4" />}>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="Password" required minLength={6} className="w-full bg-transparent text-sm outline-none" />
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </Field>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[var(--primary)]" /> Remember me</label>
                <button type="button" onClick={() => setMode("forgot")} className="font-medium text-primary hover:underline">Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={busy} className="w-full rounded-full gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 disabled:opacity-60">
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>New to GlowMate? <button onClick={() => setMode("signup")} className="font-medium text-primary hover:underline">Sign up</button></>
            ) : mode === "signup" ? (
              <>Already have an account? <button onClick={() => setMode("login")} className="font-medium text-primary hover:underline">Sign in</button></>
            ) : (
              <button onClick={() => setMode("login")} className="font-medium text-primary hover:underline">Back to sign in</button>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-muted-foreground focus-within:border-primary">
      {icon}{children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 8.1 29.3 6 24 6 14.1 6 6 14.1 6 24s8.1 18 18 18c9.9 0 18-8.1 18-18 0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 8.1 29.3 6 24 6 16.3 6 9.7 10.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 42c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 32.9 26.7 34 24 34c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 37.6 16.2 42 24 42z"/><path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C40.9 36.3 44 30.7 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}
