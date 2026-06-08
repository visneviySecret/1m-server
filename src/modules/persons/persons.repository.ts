import { getPool } from "../../database/db.js";
import type { Person } from "./persons.types.js";

export async function findPersons(
  limit: number,
  offset: number,
  selected: boolean
): Promise<Person[]> {
  const [rows] = await getPool().query(
    "SELECT id, age, name, selected FROM persons WHERE selected = ? ORDER BY id LIMIT ? OFFSET ?",
    [selected, limit, offset]
  );

  return rows as Person[];
}
