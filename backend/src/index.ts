import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT ?? 8000);

app.use(cors());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
