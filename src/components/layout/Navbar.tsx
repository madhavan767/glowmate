import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, User, Settings, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/artists", label: "Artists" },
  { to: "/matchmaker", label: "AI Matchmaker" },
  { to: "/advisor", label: "AI Advisor" },
  { to: "/packages", label: "Packages" },
  { to: "/timeline", label: "Timeline Planner" },
  { to: "/bookings", label: "Bookings" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/help", label: "Help Center" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="GlowMate AI" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-xl font-bold tracking-tight text-gradient">GlowMate AI</span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent/60 hover:text-foreground",
                pathname === l.to && "bg-accent text-accent-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative hidden xl:block">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm hover:bg-accent/50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                  {(user.email ?? "G")[0].toUpperCase()}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onMouseLeave={() => setMenu(false)}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-glow"
                  >
                    <p className="truncate px-3 py-2 text-xs text-muted-foreground">{user.email}</p>
                    {[
                      { to: "/profile", label: "My Profile", icon: User },
                      { to: "/settings", label: "Settings", icon: Settings },
                      { to: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
                    ].map((m) => (
                      <Link key={m.to} to={m.to} onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent">
                        <m.icon className="h-4 w-4" /> {m.label}
                      </Link>
                    ))}
                    <button onClick={() => { setMenu(false); signOut(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth" className="hidden rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 xl:inline-flex">
              Sign in
            </Link>
          )}

          <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-full p-2 hover:bg-accent xl:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/40 xl:hidden" />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-background p-5 shadow-glow xl:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-gradient">GlowMate AI</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-accent"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={cn("block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent", pathname === l.to && "bg-accent text-accent-foreground")}>
                    {l.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-accent"><User className="h-4 w-4" />Profile</Link>
                <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-accent"><Settings className="h-4 w-4" />Settings</Link>
                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-accent"><LayoutDashboard className="h-4 w-4" />Admin</Link>
                <Link to="/guide" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-accent"><Heart className="h-4 w-4" />User Guide</Link>
              </div>
              {user ? (
                <button onClick={() => { setOpen(false); signOut(); }} className="mt-3 flex items-center justify-center gap-2 rounded-full border border-destructive/40 px-5 py-2.5 text-sm font-semibold text-destructive">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="mt-3 rounded-full gradient-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground">Sign in / Sign up</Link>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
