import express from "express";
import cors from "cors";
import { allowedOrigins } from "./config.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { appRouter } from "./router.js";

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.use("/", appRouter);
app.use(errorHandler);

export default app;
