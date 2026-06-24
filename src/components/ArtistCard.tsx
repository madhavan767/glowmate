import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, MapPin, Briefcase, BadgeCheck } from "lucide-react";
import type { Artist } from "@/lib/data/artists";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

export function ArtistCard({
  artist,
  wishlisted,
  onToggleWishlist,
  index = 0,
}: {
  artist: Artist;
  wishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 12) * 0.04 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card hover-lift"
    >
      <Link to="/artists/$id" params={{ id: artist.id }} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={artist.image}
            alt={`${artist.name}, bridal makeup artist`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            {artist.trending && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-soft">
                Trending
              </span>
            )}
            {artist.topRated && (
              <span className="rounded-full glass px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                Top Rated
              </span>
            )}
          </div>
          <span
            className={cn(
              "absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-medium",
              artist.available ? "bg-emerald-500/90 text-white" : "bg-muted-foreground/80 text-white",
            )}
          >
            {artist.available ? "Available" : "Booked this week"}
          </span>
        </div>
      </Link>

      {onToggleWishlist && (
        <button
          onClick={() => onToggleWishlist(artist.id)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-foreground transition hover:scale-110"
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-primary text-primary")} />
        </button>
      )}

      <div className="p-4">
        <Link to="/artists/$id" params={{ id: artist.id }}>
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold leading-tight">{artist.name}</h3>
            <BadgeCheck className="h-4 w-4 text-primary" />
          </div>
        </Link>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{artist.specialization}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <StarRating rating={artist.rating} />
          <span className="font-medium text-foreground">{artist.rating}</span>
          <span>({artist.reviewsCount})</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{artist.location.replace(", Delhi", "")}</span>
          <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{artist.experience} yrs</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div>
            <span className="text-[10px] text-muted-foreground">Bridal from</span>
            <p className="font-display text-lg font-bold text-gradient">₹{artist.price.toLocaleString("en-IN")}</p>
          </div>
          <Link
            to="/artists/$id"
            params={{ id: artist.id }}
            className="rounded-full gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
