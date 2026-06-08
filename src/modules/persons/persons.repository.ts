import { getPool } from "../../database/db.js";
import type { Person } from "./persons.types.js";

export async function findPersons(
  limit: number,
  offset: number
): Promise<Person[]> {
  const [rows] = await getPool().query(
    "SELECT id, age, name, selected FROM persons ORDER BY id LIMIT ? OFFSET ?",
    [limit, offset]
  );

  return rows as Person[];
}
