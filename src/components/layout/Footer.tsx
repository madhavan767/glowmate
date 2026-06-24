import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-20 border-t border-border gradient-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlowMate AI" width={36} height={36} className="h-9 w-9" loading="lazy" />
            <span className="font-display text-lg font-bold text-gradient">GlowMate AI</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Delhi's AI bridal beauty concierge. Find your perfect makeup artist in minutes.
          </p>
          <div className="mt-4 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/artists" className="hover:text-primary">Artists</Link></li>
            <li><Link to="/matchmaker" className="hover:text-primary">AI Matchmaker</Link></li>
            <li><Link to="/packages" className="hover:text-primary">Packages</Link></li>
            <li><Link to="/timeline" className="hover:text-primary">Timeline Planner</Link></li>
            <li><Link to="/guide" className="hover:text-primary">User Guide</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms &amp; Conditions</Link></li>
            <li><Link to="/refund" className="hover:text-primary">Refund Policy</Link></li>
            <li><Link to="/cookies" className="hover:text-primary">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Stay glowing</h4>
          <p className="mt-3 text-sm text-muted-foreground">Bridal tips &amp; artist drops in your inbox.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) { toast.success("Subscribed! Welcome to GlowMate 💖"); setEmail(""); } }}
            className="mt-3 flex overflow-hidden rounded-full border border-border bg-card"
          >
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Your email" className="w-full bg-transparent px-4 py-2 text-sm outline-none" />
            <button type="submit" aria-label="Subscribe" className="flex items-center gap-1 gradient-primary px-4 text-sm font-semibold text-primary-foreground"><Mail className="h-4 w-4" /></button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GlowMate AI · Made with 💖 in Delhi · support@glowmate.ai
      </div>
    </footer>
  );
}
