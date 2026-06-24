export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewsCount: number;
  specialization: string;
  styles: string[];
  experience: number;
  location: string;
  price: number;
  languages: string[];
  available: boolean;
  trending: boolean;
  topRated: boolean;
  bio: string;
  portfolio: string[];
  services: { name: string; price: number; duration: string; desc: string }[];
  reviews: Review[];
}

const portraitPool = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=600&q=80",
];

const bridalPool = [
  "https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&q=80",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
  "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=800&q=80",
  "https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?w=800&q=80",
  "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?w=800&q=80",
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
];

const names = [
  "Aanya Kapoor", "Meher Sethi", "Riya Malhotra", "Naina Bhardwaj", "Simran Ahuja",
  "Tanya Khanna", "Pooja Rana", "Ishita Verma", "Kritika Sharma", "Aditi Chopra",
  "Sanya Grover", "Diya Mehta", "Nikita Bedi", "Roshni Gill", "Anjali Saxena",
  "Manvi Tandon", "Shreya Aggarwal", "Kavya Nair", "Priya Suri", "Mahima Bajaj",
  "Neha Dhillon", "Tara Walia", "Jasmine Kohli", "Aarohi Sood", "Vanya Bhalla",
  "Reet Anand", "Sara Mathur", "Mishti Kaur", "Avni Goyal", "Lavanya Reddy",
];
const specializations = [
  "HD & Airbrush Bridal Makeup", "Traditional Bridal & Hairstyling", "Celebrity Bridal Glam",
  "Natural Dewy Bridal Looks", "Luxury Airbrush Artistry", "Engagement & Reception Glam",
  "South Indian Bridal Specialist", "Editorial & Fashion Makeup",
];
const locations = [
  "South Extension, Delhi", "Hauz Khas, Delhi", "Rajouri Garden, Delhi", "Greater Kailash, Delhi",
  "Lajpat Nagar, Delhi", "Pitampura, Delhi", "Janakpuri, Delhi", "Defence Colony, Delhi",
  "Vasant Kunj, Delhi", "Karol Bagh, Delhi", "Dwarka, Delhi", "Rohini, Delhi",
];
const styleOptions = ["Glam", "Natural", "Traditional", "HD", "Airbrush", "Dewy", "Bold", "Minimal"];
const langOptions = ["Hindi", "English", "Punjabi", "Urdu", "Tamil"];

function pick<T>(arr: T[], n: number, seed: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(arr[(seed + i * 3) % arr.length]);
  return Array.from(new Set(out));
}

const reviewTexts = [
  "Absolutely stunning work! My bridal look lasted the entire 12-hour function and photos came out flawless.",
  "So professional and calming on a stressful morning. The airbrush base was lightweight and glowing.",
  "Listened to exactly what I wanted and elevated it. Every guest asked who did my makeup.",
  "Worth every rupee. The trial helped us perfect the look before the big day.",
  "Punctual, hygienic, and incredibly talented. My mother and bridesmaids loved their looks too.",
  "The dewy finish was exactly the modern look I dreamed of. Highly recommend for any Delhi bride.",
];
const reviewers = ["Shivani G.", "Aishwarya P.", "Komal R.", "Devanshi M.", "Harleen K.", "Megha T."];

export const artists: Artist[] = names.map((name, i) => {
  const rating = +(4.5 + ((i * 7) % 5) / 10).toFixed(1);
  const price = 18000 + ((i * 4500) % 62000);
  const exp = 4 + (i % 14);
  return {
    id: `artist-${i + 1}`,
    name,
    image: portraitPool[i % portraitPool.length],
    rating: Math.min(rating, 5),
    reviewsCount: 60 + ((i * 23) % 340),
    specialization: specializations[i % specializations.length],
    styles: pick(styleOptions, 3, i),
    experience: exp,
    location: locations[i % locations.length],
    price,
    languages: pick(langOptions, 2 + (i % 2), i),
    available: i % 4 !== 0,
    trending: i % 3 === 0,
    topRated: rating >= 4.8,
    bio: `${name} is a Delhi-based bridal artist with ${exp}+ years crafting unforgettable wedding looks. Specialising in ${specializations[i % specializations.length].toLowerCase()}, she blends premium products with techniques tailored to every skin tone and Indian wedding ceremony — from haldi to reception.`,
    portfolio: [
      bridalPool[i % bridalPool.length],
      bridalPool[(i + 1) % bridalPool.length],
      bridalPool[(i + 2) % bridalPool.length],
      bridalPool[(i + 3) % bridalPool.length],
      portraitPool[(i + 4) % portraitPool.length],
      portraitPool[(i + 2) % portraitPool.length],
    ],
    services: [
      { name: "Bridal Makeup (HD)", price, duration: "3 hrs", desc: "Complete bridal look with HD base, eyes, draping & hairstyling." },
      { name: "Engagement Makeup", price: Math.round(price * 0.6), duration: "2 hrs", desc: "Glam yet fresh look for your engagement ceremony." },
      { name: "Reception Makeup", price: Math.round(price * 0.7), duration: "2.5 hrs", desc: "Bold, photo-ready glam for your reception evening." },
      { name: "Hair Styling", price: Math.round(price * 0.3), duration: "1 hr", desc: "Bun, curls or braids styled to your outfit." },
      { name: "Mehendi Day Look", price: Math.round(price * 0.4), duration: "1.5 hrs", desc: "Light, vibrant makeup for haldi & mehendi." },
    ],
    reviews: [0, 1, 2].map((r) => ({
      name: reviewers[(i + r) % reviewers.length],
      rating: r === 2 ? 4 : 5,
      date: ["2 weeks ago", "1 month ago", "3 months ago"][r],
      text: reviewTexts[(i + r) % reviewTexts.length],
    })),
  };
});

export const getArtist = (id: string) => artists.find((a) => a.id === id);
