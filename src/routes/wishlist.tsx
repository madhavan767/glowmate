import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { artists } from "@/lib/data/artists";
import { ArtistCard } from "@/components/ArtistCard";
import { useWishlist } from "@/lib/useWishlist";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/lib/auth";
import { SignInPrompt } from "@/components/SignInPrompt";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "My Wishlist · GlowMate AI" }, { name: "description", content: "Your saved bridal makeup artists." }] }),
  component: Wishlist,
});

function Wishlist() {
  const { user } = useAuth();
  const { ids, has, toggle, loading } = useWishlist();
  const saved = artists.filter((a) => ids.includes(a.id));

  return (
    <div>
      <PageHero title="My Wishlist" subtitle="Your shortlisted bridal artists, saved for later." crumb="Wishlist" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        {!user ? <SignInPrompt title="Sign in to view your wishlist" /> : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map((i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted" />)}</div>
        ) : saved.length === 0 ? (
          <EmptyState icon={Heart} title="Your wishlist is empty" description="Tap the heart on any artist to save them here." action={<Link to="/artists" className="rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Browse Artists</Link>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{saved.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} wishlisted={has(a.id)} onToggleWishlist={toggle} />)}</div>
        )}
      </div>
    </div>
  );
}
