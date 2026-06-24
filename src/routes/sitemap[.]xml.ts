import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { artists } from "@/lib/data/artists";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", "/artists", "/matchmaker", "/advisor", "/packages", "/timeline", "/help", "/guide", "/about", "/privacy", "/terms", "/refund", "/cookies", ...artists.map((a) => `/artists/${a.id}`)];
        const urls = paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
