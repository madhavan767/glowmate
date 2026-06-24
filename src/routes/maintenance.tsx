import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/maintenance")({
  head: () => ({ meta: [{ title: "Under Maintenance · GlowMate AI" }] }),
  component: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <img src={logo} alt="GlowMate AI" className="h-14 w-14" />
      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-soft text-primary"><Wrench className="h-8 w-8 animate-float" /></div>
      <h1 className="mt-6 font-display text-3xl font-bold">We're polishing things up ✨</h1>
      <p className="mt-2 max-w-md text-muted-foreground">GlowMate is undergoing scheduled maintenance. We'll be back shortly with an even more radiant experience.</p>
      <Link to="/" className="mt-6 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Back to Home</Link>
    </div>
  ),
});
