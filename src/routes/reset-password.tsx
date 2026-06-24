import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password · GlowMate AI" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated! You can now sign in.");
    navigate({ to: "/auth" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2"><img src={logo} alt="GlowMate AI" className="h-10 w-10" /><span className="font-display text-xl font-bold text-gradient">GlowMate AI</span></div>
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password for your account.</p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-muted-foreground"><Lock className="h-4 w-4" /><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} placeholder="New password" className="w-full bg-transparent text-sm outline-none" /></div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-muted-foreground"><Lock className="h-4 w-4" /><input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" required minLength={6} placeholder="Confirm password" className="w-full bg-transparent text-sm outline-none" /></div>
        </div>
        <button type="submit" disabled={busy} className="mt-5 w-full rounded-full gradient-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Updating…" : "Update password"}</button>
        <Link to="/auth" className="mt-4 block text-center text-sm text-primary hover:underline">Back to sign in</Link>
      </form>
    </div>
  );
}
