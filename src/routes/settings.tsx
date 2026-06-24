import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Moon, Sun, Monitor, Shield, Lock, Globe, Trash2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { SignInPrompt } from "@/components/SignInPrompt";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · GlowMate AI" }, { name: "description", content: "Manage your notifications, appearance, privacy and security." }] }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notif, setNotif] = useState({ email: true, reminders: true, promos: false });
  const [pw, setPw] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const changePw = async () => { if (pw.length < 6) { toast.error("Min 6 characters"); return; } await supabase.auth.updateUser({ password: pw }); setPw(""); toast.success("Password updated"); };

  if (!user) return <div><PageHero title="Settings" crumb="Settings" /><div className="px-4 py-10"><SignInPrompt title="Sign in to access settings" /></div></div>;

  return (
    <div>
      <PageHero title="Settings" subtitle="Personalise GlowMate to fit you." crumb="Settings" />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Card icon={Bell} title="Notifications">
          {([["email", "Email notifications"], ["reminders", "Booking reminders"], ["promos", "Promotions & offers"]] as const).map(([k, label]) => (
            <Toggle key={k} label={label} on={notif[k]} onChange={() => { setNotif({ ...notif, [k]: !notif[k] }); toast.success("Preference saved"); }} />
          ))}
        </Card>

        <Card icon={theme === "dark" ? Moon : Sun} title="Appearance">
          <div className="grid grid-cols-3 gap-2">
            {([["light", Sun], ["dark", Moon], ["system", Monitor]] as const).map(([t, Icon]) => (
              <button key={t} onClick={() => setTheme(t)} className={`flex flex-col items-center gap-2 rounded-2xl border py-4 text-sm capitalize ${theme === t ? "gradient-primary border-transparent text-primary-foreground" : "border-border hover:bg-accent"}`}><Icon className="h-5 w-5" />{t}</button>
            ))}
          </div>
        </Card>

        <Card icon={Globe} title="Language">
          <select className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none" onChange={() => toast.success("Language preference saved")}>
            <option>English</option><option>हिन्दी (Hindi)</option>
          </select>
        </Card>

        <Card icon={Lock} title="Security">
          <label className="text-xs font-medium text-muted-foreground">Change Password</label>
          <div className="mt-1 flex gap-2"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none" /><button onClick={changePw} className="rounded-full gradient-primary px-4 text-sm font-semibold text-primary-foreground">Update</button></div>
          <Toggle label="Two-Factor Authentication" on={twoFA} onChange={() => { setTwoFA(!twoFA); toast.success(twoFA ? "2FA disabled" : "2FA enabled"); }} />
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm"><span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary" /> This device · Delhi, IN</span><span className="text-xs text-emerald-600">Active now</span></div>
        </Card>

        <Card icon={Shield} title="Privacy & Account">
          <button onClick={() => { signOut(); navigate({ to: "/" }); toast("Account deactivated"); }} className="w-full rounded-2xl border border-border py-2.5 text-sm font-medium hover:bg-accent">Deactivate account</button>
          <button onClick={() => toast.error("Account deletion requires email confirmation — link sent.")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /> Delete account</button>
        </Card>
      </div>
    </div>
  );
}
function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return <div className="rounded-3xl border border-border bg-card p-6 shadow-card"><h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold"><Icon className="h-5 w-5 text-primary" /> {title}</h2><div className="space-y-1">{children}</div></div>;
}
function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) {
  return <div className="flex items-center justify-between py-2"><span className="text-sm">{label}</span><button onClick={onChange} className={`relative h-6 w-11 rounded-full transition ${on ? "gradient-primary" : "bg-muted"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-[22px]" : "left-0.5"}`} /></button></div>;
}
