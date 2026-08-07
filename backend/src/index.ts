import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT ?? 8000);

app.use(cors());

interface Item {
  id: number;
  title: string;
  body: string;
  color: string;
  imageUrl: string;
}

const TOTAL_ITEMS = 200;

function hueFor(id: number): number {
  return (id * 37) % 360;
}

function makeItem(id: number): Item {
  return {
    id,
    title: `Item #${id}`,
    body: `This is fake content for item ${id}. IntersectionObserver revealed this card as it entered the viewport.`,
    color: `hsl(${hueFor(id)}, 70%, 55%)`,
    imageUrl: `/api/items/${id}/image.svg`,
  };
}

function makeImageSvg(id: number): string {
  const hue = hueFor(id);
  const from = `hsl(${hue}, 70%, 55%)`;
  const to = `hsl(${(hue + 40) % 360}, 70%, 40%)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="360" fill="url(#g)"/>
  <circle cx="${120 + (id % 5) * 80}" cy="${90 + (id % 3) * 60}" r="90" fill="rgba(255,255,255,0.12)"/>
  <text x="50%" y="52%" text-anchor="middle" font-family="system-ui, sans-serif"
        font-size="120" font-weight="700" fill="rgba(255,255,255,0.85)">${id}</text>
</svg>`;
}

app.get("/api/items/:id/image.svg", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > TOTAL_ITEMS) {
    res.status(404).send("Not found");
    return;
  }
  res.type("image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(makeImageSvg(id));
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
