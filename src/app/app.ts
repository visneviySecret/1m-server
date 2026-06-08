import express, { type Request, type Response } from "express";
import cors from "cors";
import { allowedOrigins } from "./config.js";
import { getPool } from "../database/db.ts";

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(1000, Math.max(1, Number(req.query.limit) || 100));
    const offset = (page - 1) * limit;

    const [rows] = await getPool().query(
      "SELECT id, age, name, selected FROM persons ORDER BY id LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database not available" });
  }
});

export default app;
