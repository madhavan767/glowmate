export interface AdvisorReply {
  match: (q: string) => boolean;
  answer: string;
}

const replies: AdvisorReply[] = [
  {
    match: (q) => /oily|oil|shine|greasy/.test(q),
    answer:
      "For **oily skin**, choose an **HD or airbrush matte base** with an oil-control primer. Set with a translucent powder and carry blotting papers for touch-ups. Two weeks before the wedding, switch to a gel-based moisturiser and a niacinamide serum to balance oil. On the day, ask your artist for a long-wear, transfer-resistant foundation.",
  },
  {
    match: (q) => /dry|flaky|dull/.test(q),
    answer:
      "For **dry skin**, prep with a hydrating sheet mask and a rich moisturiser 30 minutes before makeup. Request a **dewy, luminous base** and avoid heavy powder. Add a few drops of facial oil into the foundation for glow, and keep a hydrating mist handy for the day.",
  },
  {
    match: (q) => /under (40|40000|forty)|budget|cheap|affordable|40000|40,000/.test(q),
    answer:
      "Great picks **under ₹40,000**: a **Bride + Reception** bundle, or **Bride + Mother** package. Many of our 4.6★+ Delhi artists offer full HD bridal makeup from ₹18,000–₹35,000. Use the **Package Generator** to auto-bundle services and unlock savings, or filter the marketplace by budget. Want me to suggest specific artists?",
  },
  {
    match: (q) => /how many days|before wedding|in advance|book.*before|advance/.test(q),
    answer:
      "Book your **bridal artist 3–6 months ahead** for peak season (Oct–Feb) and 6–8 weeks for off-season. Schedule your **makeup trial ~30 days before**, a **hair spa at 45 days**, **skin treatments starting 60 days out**, and a **relaxation/clean-up at 1 day**. The **Timeline Planner** builds this automatically from your wedding date.",
  },
  {
    match: (q) => /glow|glowing|skin care|skincare|routine|maintain/.test(q),
    answer:
      "For a natural **glow**: cleanse twice daily, exfoliate 2x a week, use **vitamin C in the morning** and **retinol at night** (stop retinol 5 days before the wedding). Hydrate (3L water/day), get a facial monthly, and never skip SPF. Start a glass-skin routine **60 days before** — exactly what the Timeline Planner schedules.",
  },
  {
    match: (q) => /trial|test/.test(q),
    answer:
      "A **makeup trial** is essential — book it ~30 days before so there's time to adjust. Bring your outfit's colour, jewellery and reference photos, and try your look in both daylight and indoor light. Most GlowMate artists offer trials; mention it when booking.",
  },
  {
    match: (q) => /hair|hairstyle|bun|curls/.test(q),
    answer:
      "Pick a **hairstyle that complements your dupatta/veil draping** and face shape — soft curls and side buns suit most brides. Get a **hair spa at 45 days** and a trim 2 weeks before. Many artists include hairstyling in the bridal package; check their Services tab.",
  },
  {
    match: (q) => /match|artist|recommend|suggest|who should/.test(q),
    answer:
      "Head to the **AI Matchmaker** — tell me your budget, skin tone, face shape, style and wedding date, and I'll rank your **top 5 verified Delhi artists** with a match score and reason for each. You can book any of them in a few taps.",
  },
];

const fallback =
  "I'm your GlowMate Beauty Advisor 💖 I can help with skincare for your skin type, choosing packages within budget, booking timelines, trials, hairstyling and finding the right artist. Try asking: *\"What makeup suits oily skin?\"* or *\"Suggest packages under ₹40000\"*.";

export function getAdvisorReply(question: string): string {
  const q = question.toLowerCase();
  const hit = replies.find((r) => r.match(q));
  return hit ? hit.answer : fallback;
}

export const suggestedQuestions = [
  "What makeup suits oily skin?",
  "Suggest packages under ₹40000",
  "How many days before wedding should I book?",
  "How to maintain glowing skin?",
];
