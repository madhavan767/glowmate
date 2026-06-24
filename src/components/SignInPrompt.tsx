import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export function SignInPrompt({ title = "Sign in to continue", description }: { title?: string; description?: string }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-soft text-primary">
        <Lock className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {description ?? "Create a free GlowMate account or sign in to access this feature."}
      </p>
      <Link
        to="/auth"
        className="mt-6 inline-flex rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
      >
        Sign in / Sign up
      </Link>
    </div>
  );
}
