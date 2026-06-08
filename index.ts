import "dotenv/config";
import { connectDatabase } from "./src/database/db.ts";
import app from "./src/app/app.js";

await connectDatabase();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
