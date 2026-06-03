import express, { type Request, type Response } from "express";
import cors from "cors";
import { allowedOrigins } from "./src/app/config.ts";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express !");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
