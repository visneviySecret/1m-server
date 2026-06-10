import "dotenv/config";
import type { RowDataPacket } from "mysql2";
import { fileURLToPath } from "url";
import { connectDatabase, getPool } from "../database/db.ts";
import {
  generatePersonAge,
  generatePersonName,
} from "../share/lib/generatePersonFields.ts";

const ITEMS = 1_000_000;
const BATCH_SIZE = 3000;

type CountRow = RowDataPacket & {
  count: number;
};

export async function seedDatabase(): Promise<void> {
  await connectDatabase();
  const pool = getPool();

  const [countRows] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS count FROM persons"
  );
  const existing = Number(countRows[0]?.count ?? 0);

  if (existing > 0) {
    console.log(`Seed skipped: ${existing} rows already exist`);
    return;
  }

  const total = ITEMS - 1;

  for (let batchStart = 0; batchStart < total; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, total);
    const values: (number | string | boolean)[] = [];
    const placeholders: string[] = [];

    for (let i = 0; i < batchEnd - batchStart; i++) {
      placeholders.push("(?, ?, ?)");
      values.push(generatePersonAge(), generatePersonName(), false);
    }

    await pool.query(
      `INSERT INTO persons (age, name, selected) VALUES ${placeholders.join(", ")}`,
      values
    );

    if (batchStart === 0 || (batchStart / BATCH_SIZE) % 10 === 0) {
      console.log(`Progress: ${batchEnd} / ${total}`);
    }
  }

  console.log(`Seed complete: ${total} rows`);
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  seedDatabase().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}
