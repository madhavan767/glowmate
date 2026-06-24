import { artists, type Artist } from "./data/artists";

export interface MatchInput {
  budget: number;
  weddingDate: string;
  skinTone: string;
  faceShape: string;
  style: string;
  venue: string;
  guests: number;
  age: number;
}

export interface MatchResult {
  artist: Artist;
  percentage: number;
  reason: string;
  packageCost: number;
}

export function generateMatches(input: MatchInput): MatchResult[] {
  const scored = artists.map((a) => {
    let score = 50;
    const reasons: string[] = [];

    // budget fit
    if (a.price <= input.budget) {
      score += 22;
      reasons.push(`fits your ₹${input.budget.toLocaleString("en-IN")} budget`);
    } else if (a.price <= input.budget * 1.15) {
      score += 8;
      reasons.push("just above budget but worth it");
    } else {
      score -= 15;
    }

    // style match
    const styleKey = input.style.split(" ")[0].replace("/", "");
    if (a.styles.some((s) => input.style.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(styleKey.toLowerCase()))) {
      score += 14;
      reasons.push(`specialises in ${input.style.toLowerCase()} looks`);
    }

    // rating
    score += (a.rating - 4.5) * 30;
    if (a.rating >= 4.8) reasons.push(`${a.rating}★ top-rated`);

    // availability
    if (a.available) {
      score += 10;
      reasons.push("available on your date");
    } else {
      score -= 12;
    }

    // experience for larger guest counts
    if (input.guests > 300 && a.experience >= 8) {
      score += 6;
      reasons.push("seasoned for large weddings");
    }

    // skin tone expertise (every verified artist, slight boost for variety)
    if (a.specialization.toLowerCase().includes("airbrush") && ["Dusky", "Deep", "Wheatish"].includes(input.skinTone)) {
      score += 5;
      reasons.push(`great with ${input.skinTone.toLowerCase()} skin tones`);
    }

    const percentage = Math.max(62, Math.min(99, Math.round(score)));
    const reason = reasons.length
      ? `Matched because she ${reasons.slice(0, 3).join(", ")}.`
      : "A strong all-round match for your wedding style.";

    return { artist: a, percentage, reason, packageCost: a.price };
  });

  return scored.sort((x, y) => y.percentage - x.percentage).slice(0, 5);
}
