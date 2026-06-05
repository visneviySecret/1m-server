import express, { type Request, type Response } from "express";
import cors from "cors";
import { allowedOrigins } from "./app/config.ts";

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express !");
});

export default app;
